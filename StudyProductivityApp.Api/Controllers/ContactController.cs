using Microsoft.AspNetCore.Mvc;
using MimeKit;
using MailKit.Net.Smtp;
using SendGrid;
using SendGrid.Helpers.Mail;

namespace StudyProductivityApp.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ContactController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly ILogger<ContactController> _logger;

        public ContactController(IConfiguration configuration, ILogger<ContactController> logger)
        {
            _configuration = configuration;
            _logger = logger;
        }

        [HttpPost]
        public async Task<IActionResult> SendEmail([FromBody] ContactRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Name) ||
                string.IsNullOrWhiteSpace(request.Email) ||
                string.IsNullOrWhiteSpace(request.Subject) ||
                string.IsNullOrWhiteSpace(request.Message))
            {
                return BadRequest("All fields are required.");
            }

            try
            {
                var apiKey = _configuration["SendGridApiKey"]; // Securely get the API key from configuration

                if (string.IsNullOrEmpty(apiKey))
                {
                    _logger.LogError("SendGrid API key is missing.");
                    return StatusCode(500, "Internal server error.");
                }

                var client = new SendGridClient(apiKey);

                var from = new EmailAddress("esmatt98@hotmail.com", "Study Productivity App");
                var to = new EmailAddress("morraesmatt@gmail.com", "Admin");

                var subject = request.Subject;

                // Create the plain text content
                var plainTextContent = $"Name: {request.Name}\nEmail: {request.Email}\nSubject: {request.Subject}\nMessage:\n{request.Message}";

                // Create the HTML content
               var htmlContent = $@"
<!DOCTYPE html>
<html>
<head>
    <style>
        body {{
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f9f9f9;
            color: #333;
        }}
        .email-container {{
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            border: 1px solid #ddd;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }}
        .email-header {{
            background-color: #4CAF50;
            color: #ffffff;
            padding: 20px;
            text-align: center;
            font-size: 24px;
            font-weight: bold;
        }}
        .email-body {{
            padding: 20px;
            line-height: 1.6;
        }}
        .email-body h2 {{
            color: #4CAF50;
            font-size: 20px;
            margin-bottom: 10px;
        }}
        .email-body p {{
            margin: 10px 0;
            font-size: 16px;
        }}
        .email-body p strong {{
            color: #333;
        }}
        .email-footer {{
            background-color: #f1f1f1;
            text-align: center;
            padding: 10px;
            font-size: 14px;
            color: #666;
        }}
    </style>
</head>
<body>
    <div class='email-container'>
        <div class='email-header'>
            New Contact Form Submission
        </div>
        <div class='email-body'>
            <h2>Contact Details</h2>
            <p><strong>Name:</strong> {request.Name}</p>
            <p><strong>Email:</strong> {request.Email}</p>
            <p><strong>Subject:</strong> {request.Subject}</p>
            <h2>Message</h2>
            <p>{System.Net.WebUtility.HtmlEncode(request.Message).Replace("\n", "<br />")}</p>
        </div>
        <div class='email-footer'>
            This message was generated automatically. Please do not reply.
        </div>
    </div>
</body>
</html>";
;

                var msg = MailHelper.CreateSingleEmail(from, to, subject, plainTextContent, htmlContent);
                var response = await client.SendEmailAsync(msg);

                if (response.IsSuccessStatusCode)
                {
                    return Ok(new { message = "Email sent successfully!" });
                }
                else
                {
                    var responseBody = await response.Body.ReadAsStringAsync();
                    _logger.LogError($"Failed to send email via SendGrid. StatusCode: {response.StatusCode}, Body: {responseBody}");
                    return StatusCode(500, "An error occurred while sending the email.");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An exception occurred while sending email.");
                return StatusCode(500, "An error occurred while sending the email.");
            }
        }
    }

    public class ContactRequest
    {
        public string Name { get; set; }
        public string Email { get; set; }
        public string Subject { get; set; } // Added Subject property
        public string Message { get; set; }
    }
}

