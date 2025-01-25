using System.IdentityModel.Tokens.Jwt;
using System.Net.Http.Headers;
using System.Text;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;

namespace StudyProductivityApp.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SignalRController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly ILogger<SignalRController> _logger;

        public SignalRController(
            IConfiguration configuration,
            IHttpClientFactory httpClientFactory,
            ILogger<SignalRController> logger)
        {
            _configuration = configuration;
            _httpClientFactory = httpClientFactory;
            _logger = logger;
        }

        [HttpPost("cleanup")]
        public async Task<IActionResult> CleanupConnections()
        {
            try
            {
                var connectionString = _configuration["azure-signalr-connectionstring"];
                if (string.IsNullOrEmpty(connectionString))
                {
                    _logger.LogError("SignalR connection string not found");
                    return BadRequest("SignalR connection string not configured");
                }

                // Parse connection string safely
                var connectionStringParts = new Dictionary<string, string>();
                foreach (var part in connectionString.Split(';', StringSplitOptions.RemoveEmptyEntries))
                {
                    var keyValue = part.Split('=', 2);
                    if (keyValue.Length == 2)
                    {
                        connectionStringParts[keyValue[0]] = keyValue[1];
                    }
                }

                var endpoint = connectionStringParts["Endpoint"].TrimEnd('/');
                var accessKey = connectionStringParts["AccessKey"];

                // Try gradual cleanup with retries
                int maxRetries = 3;
                int currentRetry = 0;
                bool success = false;

                while (currentRetry < maxRetries && !success)
                {
                    try
                    {
                        // First, try to get current connections
                        var httpClient = _httpClientFactory.CreateClient("SignalR");
                        var tokenString = CreateSignalRToken(endpoint, accessKey);

                        // Try to close connections in smaller batches
                        var requestUrl = $"{endpoint}/client/api/v1/hubs/chathub/connections";

                        using var request = new HttpRequestMessage(HttpMethod.Delete, requestUrl);
                        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", tokenString);
                        request.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

                        var response = await httpClient.SendAsync(request);

                        if (response.IsSuccessStatusCode)
                        {
                            success = true;
                            _logger.LogInformation("Successfully cleaned up SignalR connections");
                            return Ok(new
                            {
                                message = "Connections cleaned up successfully",
                                timestamp = DateTime.UtcNow,
                                attempt = currentRetry + 1
                            });
                        }
                        else if (response.StatusCode == System.Net.HttpStatusCode.TooManyRequests)
                        {
                            // If we hit rate limit, wait before retry
                            _logger.LogWarning("Rate limit hit, waiting before retry. Attempt: {Attempt}", currentRetry + 1);
                            await Task.Delay(TimeSpan.FromSeconds(Math.Pow(2, currentRetry))); // Exponential backoff
                        }
                        else
                        {
                            var error = await response.Content.ReadAsStringAsync();
                            _logger.LogError("Failed to cleanup connections. Status: {Status}, Error: {Error}",
                                response.StatusCode, error);
                            return StatusCode((int)response.StatusCode, new
                            {
                                error = $"Failed to cleanup connections: {response.StatusCode}",
                                details = error
                            });
                        }
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError(ex, "Error during cleanup attempt {Attempt}", currentRetry + 1);
                    }

                    currentRetry++;
                    await Task.Delay(1000); // Wait between retries
                }

                if (!success)
                {
                    return StatusCode(500, new
                    {
                        error = "Failed to cleanup connections after multiple attempts",
                        attempts = currentRetry
                    });
                }

                return Ok(new { message = "Cleanup completed" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in cleanup process");
                return StatusCode(500, new
                {
                    error = "Internal server error during cleanup",
                    message = ex.Message
                });
            }
        }

        // Add a method to get current connection count
        [HttpGet("connections")]
        public async Task<IActionResult> GetConnectionCount()
        {
            try
            {
                var connectionString = _configuration["azure-signalr-connectionstring"];
                var connectionStringParts = connectionString.Split(';')
                    .Select(part => part.Split('=', 2))
                    .Where(parts => parts.Length == 2)
                    .ToDictionary(parts => parts[0], parts => parts[1]);

                var endpoint = connectionStringParts["Endpoint"].TrimEnd('/');
                var accessKey = connectionStringParts["AccessKey"];

                var httpClient = _httpClientFactory.CreateClient("SignalR");
                var tokenString = CreateSignalRToken(endpoint, accessKey);

                var requestUrl = $"{endpoint}/api/v1/hubs/chathub/connections";
                using var request = new HttpRequestMessage(HttpMethod.Get, requestUrl);
                request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", tokenString);

                var response = await httpClient.SendAsync(request);
                var content = await response.Content.ReadAsStringAsync();

                return Ok(new
                {
                    statusCode = response.StatusCode,
                    content = content
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        [HttpGet("status")]
        public async Task<IActionResult> GetConnectionStatus()
        {
            try
            {
                var connectionString = _configuration["azure-signalr-connectionstring"];
                if (string.IsNullOrEmpty(connectionString))
                {
                    return BadRequest("SignalR connection string not configured");
                }

                var connectionStringParts = connectionString.Split(';')
                    .Select(part => part.Split('='))
                    .ToDictionary(split => split[0], split => split[1]);

                var endpoint = connectionStringParts["Endpoint"].TrimEnd('/');
                var accessKey = connectionStringParts["AccessKey"];

                var tokenString = CreateSignalRToken(endpoint, accessKey);
                var httpClient = _httpClientFactory.CreateClient("SignalR");

                var requestUrl = $"{endpoint}/api/v1/hubs/chathub/connections";

                using var request = new HttpRequestMessage(HttpMethod.Get, requestUrl);
                request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", tokenString);
                request.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

                var response = await httpClient.SendAsync(request);

                if (response.IsSuccessStatusCode)
                {
                    var content = await response.Content.ReadAsStringAsync();
                    return Ok(new
                    {
                        status = "Active",
                        details = content,
                        timestamp = DateTime.UtcNow
                    });
                }

                return StatusCode((int)response.StatusCode, await response.Content.ReadAsStringAsync());
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting connection status");
                return StatusCode(500, new { error = ex.Message });
            }
        }

        [HttpPost("force-cleanup")]
        public async Task<IActionResult> ForceCleanup()
        {
            try
            {
                // First, try normal cleanup
                var cleanupResult = await CleanupConnections() as ObjectResult;

                if (cleanupResult?.StatusCode == 200)
                {
                    return cleanupResult;
                }

                // If normal cleanup failed, try to force close connections
                var connectionString = _configuration["azure-signalr-connectionstring"];
                var connectionStringParts = connectionString.Split(';')
                    .Select(part => part.Split('=', 2))
                    .Where(parts => parts.Length == 2)
                    .ToDictionary(parts => parts[0], parts => parts[1]);

                var endpoint = connectionStringParts["Endpoint"].TrimEnd('/');
                var accessKey = connectionStringParts["AccessKey"];

                var httpClient = _httpClientFactory.CreateClient("SignalR");
                var tokenString = CreateSignalRToken(endpoint, accessKey);

                // Force close all connections
                var requestUrl = $"{endpoint}/api/v1/hubs/chathub/connections?force=true";
                using var request = new HttpRequestMessage(HttpMethod.Delete, requestUrl);
                request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", tokenString);

                var response = await httpClient.SendAsync(request);

                if (response.IsSuccessStatusCode)
                {
                    return Ok(new
                    {
                        message = "Connections forcefully cleaned up",
                        timestamp = DateTime.UtcNow
                    });
                }

                var error = await response.Content.ReadAsStringAsync();
                return StatusCode((int)response.StatusCode, new
                {
                    error = "Force cleanup failed",
                    details = error
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        private string CreateSignalRToken(string endpoint, string accessKey)
        {
            try
            {
                var audience = endpoint.Replace("https://", "").Replace("http://", "");
                var tokenHandler = new JwtSecurityTokenHandler();
                var key = Encoding.UTF8.GetBytes(accessKey);

                var tokenDescriptor = new SecurityTokenDescriptor
                {
                    Audience = audience,
                    Issuer = audience,
                    Expires = DateTime.UtcNow.AddMinutes(30),
                    SigningCredentials = new SigningCredentials(
                        new SymmetricSecurityKey(key),
                        SecurityAlgorithms.HmacSha256Signature
                    ),
                    Claims = new Dictionary<string, object>
                    {
                        { "nameid", "cleanup-service" }
                    }
                };

                var token = tokenHandler.CreateToken(tokenDescriptor);
                return tokenHandler.WriteToken(token);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating SignalR token");
                throw;
            }
        }
    }
}