using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using StudyProductivityApp.Core.Models;
using StudyProductivityApp.Persistence.Data;
using StudyProductivityApp.Persistence.Repositories;
using Xunit;

namespace StudyProductivityApp.Persistence.Tests
{
    public class UserRepositoryTests : IDisposable
    {
        private readonly StudyProductivityDbContext _context; // Use the actual DbContext for repository
        private readonly UserRepository _userRepository;

        public UserRepositoryTests()
        {
            var options = new DbContextOptionsBuilder<StudyProductivityDbContext>() // Use the same DbContext type
                .UseInMemoryDatabase("TestStudyProductivityDb")
                .Options;

            _context = new StudyProductivityDbContext(options); // Use the correct DbContext
            _userRepository = new UserRepository(_context);

            SeedData();
        }

        private void SeedData()
        {
            _context.Users.AddRange(new List<User>
            {
                new User { UserId = "user1", Username = "testuser1", Email = "test1@example.com" },
                new User { UserId = "user2", Username = "testuser2", Email = "test2@example.com" }
            });

            _context.UserProfiles.AddRange(new List<UserProfile>
            {
                new UserProfile { UserId = "user1", Bio = "Bio1", ProfileImageUrl = "url1" },
                new UserProfile { UserId = "user2", Bio = "Bio2", ProfileImageUrl = "url2" }
            });

            _context.SaveChanges();
        }

        [Fact]
        public async Task AddAsync_ShouldAddUser()
        {
            var user = new User { UserId = "user3", Username = "testuser3", Email = "test3@example.com" };

            await _userRepository.AddAsync(user);

            var result = await _context.Users.FindAsync("user3");

            Assert.NotNull(result);
            Assert.Equal("testuser3", result.Username);
        }

        [Fact]
        public async Task GetTotalUsersAsync_ShouldReturnCorrectCount()
        {
            var result = await _userRepository.GetTotalUsersAsync();

            Assert.Equal(2, result);
        }

        [Fact]
        public async Task GetUserByIdAsync_ShouldReturnUser_WhenUserExists()
        {
            var result = await _userRepository.GetUserByIdAsync("user1");

            Assert.NotNull(result);
            Assert.Equal("testuser1", result.Username);
        }

        [Fact]
        public async Task GetUserByIdAsync_ShouldThrowKeyNotFoundException_WhenUserDoesNotExist()
        {
            await Assert.ThrowsAsync<KeyNotFoundException>(async () =>
                await _userRepository.GetUserByIdAsync("nonexistentUserId"));
        }

        [Fact]
        public async Task ExistsByEmailAsync_ShouldReturnTrue_WhenEmailExists()
        {
            var result = await _userRepository.ExistsByEmailAsync("test1@example.com");

            Assert.True(result);
        }

        [Fact]
        public async Task ExistsByEmailAsync_ShouldReturnFalse_WhenEmailDoesNotExist()
        {
            var result = await _userRepository.ExistsByEmailAsync("nonexistent@example.com");

            Assert.False(result);
        }

        [Fact]
        public async Task AddUserProfileAsync_ShouldAddProfile_WhenUserExists()
        {
            var userProfile = new UserProfile
            {
                UserProfileId = 197,
                UserId = "user1",
                Bio = "Updated Bio",
                ProfileImageUrl = "updatedUrl"
            };

            await _userRepository.AddUserProfileAsync(userProfile);

            // Use the correct key type for FindAsync
            var result = await _context.UserProfiles.FindAsync(197);
            Assert.NotNull(result);
            Assert.Equal("Updated Bio", result.Bio);
        }


        [Fact]
        public async Task UpdateUserProfileAsync_ShouldUpdateProfile_WhenUserProfileExists()
        {
            var result = await _userRepository.UpdateUserProfileAsync("user1", "New Bio", "newUrl");

            Assert.NotNull(result);
            Assert.Equal("New Bio", result.Bio);
            Assert.Equal("newUrl", result.ProfileImageUrl);
        }

        [Fact]
        public async Task UpdateUserProfileAsync_ShouldReturnNull_WhenUserProfileDoesNotExist()
        {
            var result = await _userRepository.UpdateUserProfileAsync("nonexistentUserId", "New Bio", "newUrl");

            Assert.Null(result);
        }

        [Fact]
        public async Task GetUserProfileAsync_ShouldReturnUserProfile_WhenUserExists()
        {
            var result = await _userRepository.GetUserProfileAsync("user1");

            Assert.NotNull(result);
            Assert.Equal("user1", result.UserId);
            Assert.Equal("Bio1", result.Bio);
        }

        [Fact]
        public async Task GetUserProfileAsync_ShouldReturnNull_WhenUserDoesNotExist()
        {
            var result = await _userRepository.GetUserProfileAsync("nonexistentUserId");

            Assert.Null(result);
        }

        [Fact]
        public async Task SearchUsersAsync_ShouldReturnUsers_WhenSearchTermMatches()
        {
            var result = await _userRepository.SearchUsersAsync("test");

            Assert.NotEmpty(result);
            Assert.Contains(result, u => u.Username.Contains("test"));
        }

        [Fact]
        public async Task GetUsersByIdsAsync_ShouldReturnUsers_WhenUserIdsExist()
        {
            var result = await _userRepository.GetUsersByIdsAsync(new List<string> { "user1", "user2" });

            Assert.Equal(2, result.Count);
            Assert.Contains(result, u => u.UserId == "user1");
            Assert.Contains(result, u => u.UserId == "user2");
        }

        public void Dispose()
        {
            _context.Database.EnsureDeleted();
            _context.Dispose();
        }
    }
}

