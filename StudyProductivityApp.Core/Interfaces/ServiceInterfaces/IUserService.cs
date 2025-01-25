using StudyProductivityApp.Core.Models;
using StudyProductivityApp.Core.Models.Dtos;

namespace StudyProductivityApp.Core.Interfaces.ServiceInterfaces
{
    public interface IUserService
{
    // Existing methods
    Task<UserDto> GetUserByIdAsync(string userId);
    Task<UserDto> CreateUserAsync(UserRegisterDto registerDto);
    Task<LoginResponseDto> LoginAsync(UserLoginDto loginDto);
    Task<UserDto> GetUserByEmailAsync(string email);
    Task<string> UpdateProfileImageAsync(string userId, string blobName);
    Task<UserProfile> UpdateUserProfileAsync(string userId, string bio, string profilePicUrl);
    Task AddUserProfileAsync(UserProfile userProfile);
    Task<UserProfile> GetUserProfileAsync(string userId);
    Task<List<User>> SearchUsersAsync(string searchTerm);
    Task<List<User>> GetUsersByIdsAsync(List<string> userIds);
    Task RefreshProfileImageSasTokens();

    // New methods
    Task<UserDto> UpdateUserAsync(string userId, string username = null, string email = null);
    Task DeleteUserAsync(string userId);
    Task<List<UserDto>> GetAllUsersAsync();
    Task UpdatePasswordAsync(string userId, string currentPassword, string newPassword);
    Task<bool> IsEmailAvailableAsync(string email);
    Task<bool> IsUsernameAvailableAsync(string username);
    Task<UserDto> GetUserByUsernameAsync(string username);
    Task<UserProfile> CreateUserProfileAsync(string userId, string bio = null);
    Task<List<UserDto>> SearchUsersAsync(string searchTerm, int? limit = null);
}
}