using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using StudyProductivityApp.Core.Interfaces.RepositoryInterfaces;
using StudyProductivityApp.Core.Models;
using StudyProductivityApp.Persistence.Data;

namespace StudyProductivityApp.Persistence.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly StudyProductivityDbContext _context;

        public UserRepository(StudyProductivityDbContext context)
        {
            _context = context;
        }

        // Create
        public async Task AddAsync(User user)
        {
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
        }

        // Read
        public async Task<User> GetUserByIdAsync(string userId)
        {
            var user = await _context.Users
                .Include(u => u.TodoTasks)
                .Include(u => u.TodoTaskLists)
                .Include(u => u.UploadedFiles)
                .Include(u => u.UserFileAccesses)
                .Include(u => u.CreatedEvents)
                .Include(u => u.JoinedEvents)
                .Include(u => u.Friends)
                .Include(u => u.FriendOf)
                .Include(u => u.GroupChats)
                .FirstOrDefaultAsync(u => u.UserId == userId);

            if (user == null)
            {
                throw new KeyNotFoundException($"User with ID {userId} was not found.");
            }

            return user;
        }

        public async Task<User?> GetUserByEmailAsync(string email)
        {
            return await _context.Users
                .FirstOrDefaultAsync(u => u.Email == email);
        }

        public async Task<User?> GetUserByUsernameAsync(string username)
        {
            if (string.IsNullOrEmpty(username))
            {
                return null;
            }

            return await _context.Users
                .FirstOrDefaultAsync(u => u.Username.ToLower() == username.ToLower());
        }

        public async Task<List<User>> GetAllUsersAsync()
        {
            return await _context.Users
                .ToListAsync();
        }

        public async Task<int> GetTotalUsersAsync()
        {
            return await _context.Users.CountAsync();
        }

        // Update
        public async Task UpdateAsync(User user)
        {
            _context.Entry(user).State = EntityState.Modified;
            await _context.SaveChangesAsync();
        }

        public async Task UpdatePasswordAsync(string userId, string passwordHash)
        {
            var user = await GetUserByIdAsync(userId);
            user.PasswordHash = passwordHash;
            await _context.SaveChangesAsync();
        }

        public async Task UpdateEmailAsync(string userId, string newEmail)
        {
            var user = await GetUserByIdAsync(userId);
            user.Email = newEmail;
            await _context.SaveChangesAsync();
        }

        public async Task UpdateUsernameAsync(string userId, string newUsername)
        {
            var user = await GetUserByIdAsync(userId);
            user.Username = newUsername;
            await _context.SaveChangesAsync();
        }

        // Delete
        public async Task DeleteAsync(string userId)
        {
            var user = await GetUserByIdAsync(userId);
            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
        }

        // Profile Management
        public async Task<UserProfile?> GetUserProfileAsync(string userId)
        {
            return await _context.UserProfiles
                .Include(up => up.User)
                    .ThenInclude(u => u.Friends)
                        .ThenInclude(f => f.FriendUser)
                .Include(up => up.User)
                    .ThenInclude(u => u.CreatedEvents)
                .Include(up => up.User)
                    .ThenInclude(u => u.JoinedEvents)
                .FirstOrDefaultAsync(up => up.UserId == userId);
        }

        public async Task AddUserProfileAsync(UserProfile userProfile)
        {
            await _context.UserProfiles.AddAsync(userProfile);
            await _context.SaveChangesAsync();
        }

        public async Task<UserProfile?> UpdateUserProfileAsync(string userId, string bio, string profilePicUrl)
        {
            var userProfile = await _context.UserProfiles
                .Include(u => u.User)
                .FirstOrDefaultAsync(u => u.UserId == userId);

            if (userProfile != null)
            {
                userProfile.Bio = bio;
                userProfile.ProfileImageUrl = profilePicUrl;
                await _context.SaveChangesAsync();
            }

            return userProfile;
        }

        // Search and Filtering
        public async Task<List<User>> SearchUsersAsync(string searchTerm)
        {
            return await _context.Users
                .Where(u => u.Username.Contains(searchTerm) || u.Email.Contains(searchTerm))
                .ToListAsync();
        }

        public async Task<List<User>> GetUsersByIdsAsync(List<string> userIds)
        {
            return await _context.Users
                .Where(u => userIds.Contains(u.UserId))
                .ToListAsync();
        }

        // Validation
        public async Task<bool> ExistsByEmailAsync(string email)
        {
            return await _context.Users.AnyAsync(u => u.Email == email);
        }

        public async Task<bool> ExistsByUsernameAsync(string username)
        {
            return await _context.Users.AnyAsync(u => u.Username == username);
        }

        // Profile Collections
        public async Task<IEnumerable<UserProfile>> GetAllUserProfilesAsync()
        {
            return await _context.UserProfiles
                .Include(p => p.User)
                .Where(p => !string.IsNullOrEmpty(p.ProfileImageUrl))
                .ToListAsync();
        }

        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }
    }

}