using StudyProductivityApp.Core.Models;

namespace StudyProductivityApp.Core.Interfaces.RepositoryInterfaces
{
    public interface IUserRepository
{
    // Create
    Task AddAsync(User user);

    // Read
    Task<User> GetUserByIdAsync(string userId);
    Task<User?> GetUserByEmailAsync(string email);
    Task<User?> GetUserByUsernameAsync(string username);
    Task<List<User>> GetAllUsersAsync();
    Task<int> GetTotalUsersAsync();

    // Update
    Task UpdateAsync(User user);
    Task UpdatePasswordAsync(string userId, string passwordHash);
    Task UpdateEmailAsync(string userId, string newEmail);
    Task UpdateUsernameAsync(string userId, string newUsername);

    // Delete
    Task DeleteAsync(string userId);

    // Profile Management
    Task<UserProfile?> GetUserProfileAsync(string userId);
    Task AddUserProfileAsync(UserProfile userProfile);
    Task<UserProfile?> UpdateUserProfileAsync(string userId, string bio, string profilePicUrl);

    // Search and Filtering
    Task<List<User>> SearchUsersAsync(string searchTerm);
    Task<List<User>> GetUsersByIdsAsync(List<string> userIds);

    // Validation
    Task<bool> ExistsByEmailAsync(string email);
    Task<bool> ExistsByUsernameAsync(string username);

    // Profile Collections
    Task<IEnumerable<UserProfile>> GetAllUserProfilesAsync();

    // Utility
    Task SaveChangesAsync();
}
}