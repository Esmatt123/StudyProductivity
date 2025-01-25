
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using StudyProductivityApp.Core.Models;
using StudyProductivityApp.Core.Interfaces.ServiceInterfaces;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using System.Text.RegularExpressions;
using StudyProductivityApp.Core.Models.Dtos;

namespace StudyProductivityApp.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly IPasswordHasher<User> _passwordHasher;
        private readonly IConfiguration _configuration;
        private readonly ILogger<UsersController> _logger;

        public UsersController(
            IUserService userService,
            IPasswordHasher<User> passwordHasher,
            IConfiguration configuration,
            ILogger<UsersController> logger)
        {
            _userService = userService;
            _passwordHasher = passwordHasher;
            _configuration = configuration;
            _logger = logger;
        }

        // DTO for user registration
        public class RegisterUserDto
        {
            public string Username { get; set; }
            public string Email { get; set; }
            public string Password { get; set; }
        }

        [HttpPost("register")]
public async Task<IActionResult> Register([FromBody] UserRegisterDto registerDto)
{
    try
    {
        _logger.LogInformation("Starting user registration process for email: {Email}", registerDto.Email);

        // Validate input
        if (string.IsNullOrEmpty(registerDto.Username) ||
            string.IsNullOrEmpty(registerDto.Email) ||
            string.IsNullOrEmpty(registerDto.Password))
        {
            _logger.LogWarning("Registration failed: Missing required fields");
            return BadRequest("Username, email, and password are required.");
        }

        if (!IsValidEmail(registerDto.Email))
        {
            _logger.LogWarning("Registration failed: Invalid email format for {Email}", registerDto.Email);
            return BadRequest("Invalid email format.");
        }

        if (!IsPasswordStrong(registerDto.Password))
        {
            _logger.LogWarning("Registration failed: Password does not meet strength requirements for user {Email}", registerDto.Email);
            return BadRequest("Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.");
        }

        // Check if email exists
        var existingUserByEmail = await _userService.GetUserByEmailAsync(registerDto.Email);
        if (existingUserByEmail != null)
        {
            _logger.LogWarning("Registration failed: Email already exists - {Email}", registerDto.Email);
            return Conflict("A user with this email already exists.");
        }

        // Check if username exists
        var existingUserByUsername = await _userService.GetUserByUsernameAsync(registerDto.Username);
        if (existingUserByUsername != null)
        {
            _logger.LogWarning("Registration failed: Username already exists - {Username}", registerDto.Username);
            return Conflict("A user with this username already exists.");
        }

        _logger.LogInformation("Creating new user for {Email}", registerDto.Email);

        // Create the user
        var createdUser = await _userService.CreateUserAsync(registerDto);

        _logger.LogInformation("User successfully created with ID: {UserId}", createdUser.UserId);

        return Ok(new
        {
            message = "User registered successfully",
            userId = createdUser.UserId,
            username = createdUser.Username,
            email = createdUser.Email
        });
    }
    catch (Exception ex)
    {
        _logger.LogError(ex, "An unexpected error occurred during user registration for email: {Email}", 
            registerDto?.Email ?? "unknown");
        
        if (_configuration.GetValue<string>("Environment") == "Development")
        {
            return StatusCode(500, $"An error occurred while registering the user: {ex.Message}");
        }

        return StatusCode(500, "An error occurred while registering the user.");
    }
}

        [HttpGet("{userId}")]
        [Authorize]
        public async Task<IActionResult> GetUser(string userId)
        {
            try
            {
                var userDto = await _userService.GetUserByIdAsync(userId);
                return Ok(userDto);
            }
            catch (KeyNotFoundException)
            {
                return NotFound("User not found.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, "An error occurred while retrieving the user.");
            }
        }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetAllUsers()
        {
            try
            {
                var users = await _userService.GetAllUsersAsync();
                return Ok(users);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "An error occurred while retrieving users.");
            }
        }

        [HttpPut("{userId}")]
        [Authorize]
        public async Task<IActionResult> UpdateUser(string userId, [FromBody] UpdateUserDto updateDto)
        {
            try
            {
                var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (currentUserId != userId)
                {
                    return Forbid();
                }

                var updatedUser = await _userService.UpdateUserAsync(userId, updateDto.Username, updateDto.Email);

                if (!string.IsNullOrEmpty(updateDto.NewPassword))
                {
                    if (!IsPasswordStrong(updateDto.NewPassword))
                    {
                        return BadRequest("New password does not meet strength requirements.");
                    }
                    await _userService.UpdatePasswordAsync(userId, updateDto.CurrentPassword, updateDto.NewPassword);
                }

                return Ok(updatedUser);
            }
            catch (KeyNotFoundException)
            {
                return NotFound("User not found.");
            }
            catch (UnauthorizedAccessException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "An error occurred while updating the user.");
            }
        }
        [HttpDelete("{userId}")]
        [Authorize]
        public async Task<IActionResult> DeleteUser(string userId)
        {
            try
            {
                var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (currentUserId != userId)
                {
                    return Forbid();
                }

                await _userService.DeleteUserAsync(userId);
                return Ok(new { message = "User deleted successfully" });
            }
            catch (KeyNotFoundException)
            {
                return NotFound("User not found.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, "An error occurred while deleting the user.");
            }
        }

        [HttpGet("check-email")]
        public async Task<IActionResult> CheckEmailAvailability([FromQuery] string email)
        {
            try
            {
                var isAvailable = await _userService.IsEmailAvailableAsync(email);
                return Ok(new { isAvailable });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "An error occurred while checking email availability.");
            }
        }

        [HttpGet("check-username")]
        public async Task<IActionResult> CheckUsernameAvailability([FromQuery] string username)
        {
            try
            {
                var isAvailable = await _userService.IsUsernameAvailableAsync(username);
                return Ok(new { isAvailable });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "An error occurred while checking username availability.");
            }
        }

        [HttpGet("search")]
        [Authorize]
        public async Task<IActionResult> SearchUsers([FromQuery] string searchTerm, [FromQuery] int? limit)
        {
            try
            {
                var users = await _userService.SearchUsersAsync(searchTerm, limit);
                return Ok(users);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "An error occurred while searching for users.");
            }
        }

        [HttpPost("{userId}/profile")]
        [Authorize]
        public async Task<IActionResult> CreateUserProfile(string userId, [FromBody] string bio)
        {
            try
            {
                var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (currentUserId != userId)
                {
                    return Forbid();
                }

                var profile = await _userService.CreateUserProfileAsync(userId, bio);
                return Ok(profile);
            }
            catch (KeyNotFoundException)
            {
                return NotFound("User not found.");
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "An error occurred while creating the user profile.");
            }
        }

        // Helper methods
        private bool IsValidEmail(string email)
        {
            try
            {
                var addr = new System.Net.Mail.MailAddress(email);
                return addr.Address == email;
            }
            catch
            {
                return false;
            }
        }

        private bool IsPasswordStrong(string password)
        {
            // Password must be at least 8 characters long and contain:
            // - At least one uppercase letter
            // - At least one lowercase letter
            // - At least one number
            // - At least one special character
            var regex = new Regex(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$");
            return regex.IsMatch(password);
        }
    }

    public class UpdateUserDto
    {
        public string? Username { get; set; }
        public string? Email { get; set; }
        public string? CurrentPassword { get; set; }
        public string? NewPassword { get; set; }
    }
}
