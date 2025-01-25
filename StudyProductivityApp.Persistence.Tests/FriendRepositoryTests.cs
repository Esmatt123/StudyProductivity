using Microsoft.EntityFrameworkCore;
using StudyProductivityApp.Core.Models;
using StudyProductivityApp.Persistence.Data;
using StudyProductivityApp.Persistence.Repositories;

namespace StudyProductivityApp.Persistence.Tests
{
    public class FriendRepositoryTests
{
    private readonly StudyProductivityDbContext _context;
    private readonly FriendRepository _repository;

    public FriendRepositoryTests()
    {
        var options = new DbContextOptionsBuilder<StudyProductivityDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;

        _context = new StudyProductivityDbContext(options);
        _repository = new FriendRepository(_context);
    }

    [Fact]
    public async Task AddFriendAsync_ShouldCreateNewFriendship_WhenNotExists()
    {
        // Arrange
        var userId = "user1";
        var friendUserId = "user2";

        // Act
        var result = await _repository.AddFriendAsync(userId, friendUserId);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(userId, result.UserId);
        Assert.Equal(friendUserId, result.FriendUserId);

        // Verify both friendship records were created
        var friendships = await _context.Friends.ToListAsync();
        Assert.Equal(2, friendships.Count);
        
        Assert.Contains(friendships, f => 
            f.UserId == userId && f.FriendUserId == friendUserId);
        Assert.Contains(friendships, f => 
            f.UserId == friendUserId && f.FriendUserId == userId);
    }

    [Fact]
    public async Task AddFriendAsync_ShouldThrowException_WhenFriendshipExists()
    {
        // Arrange
        var userId = "user1";
        var friendUserId = "user2";

        // Create existing friendship
        var existingFriend1 = new Friend
        {
            FriendId = Guid.NewGuid().ToString(),
            UserId = userId,
            FriendUserId = friendUserId
        };
        var existingFriend2 = new Friend
        {
            FriendId = Guid.NewGuid().ToString(),
            UserId = friendUserId,
            FriendUserId = userId
        };

        await _context.Friends.AddRangeAsync(existingFriend1, existingFriend2);
        await _context.SaveChangesAsync();

        // Act & Assert
        await Assert.ThrowsAsync<InvalidOperationException>(
            async () => await _repository.AddFriendAsync(userId, friendUserId)
        );
    }

    [Fact]
    public async Task GetFriendsAsync_ShouldReturnUsersFriends()
    {
        // Arrange
        var userId = "user1";
        var friendUserId = "user2";

        var friend = new Friend
        {
            FriendId = Guid.NewGuid().ToString(),
            UserId = userId,
            FriendUserId = friendUserId,
            FriendUser = new User { UserId = friendUserId, Username = "Friend User" }
        };

        await _context.Friends.AddAsync(friend);
        await _context.SaveChangesAsync();

        // Act
        var friends = await _repository.GetFriendsAsync(userId);

        // Assert
        Assert.Single(friends);
        Assert.Equal(friendUserId, friends[0].FriendUserId);
        Assert.NotNull(friends[0].FriendUser);
        Assert.Equal("Friend User", friends[0].FriendUser.Username);
    }

    [Fact]
    public async Task DeleteFriendAsync_ShouldRemoveBothFriendships()
    {
        // Arrange
        var userId = "user1";
        var friendUserId = "user2";

        var friend1 = new Friend
        {
            FriendId = Guid.NewGuid().ToString(),
            UserId = userId,
            FriendUserId = friendUserId
        };
        var friend2 = new Friend
        {
            FriendId = Guid.NewGuid().ToString(),
            UserId = friendUserId,
            FriendUserId = userId
        };

        await _context.Friends.AddRangeAsync(friend1, friend2);
        await _context.SaveChangesAsync();

        // Act
        await _repository.DeleteFriendAsync(userId, friendUserId);

        // Assert
        var remainingFriendships = await _context.Friends.ToListAsync();
        Assert.Empty(remainingFriendships);
    }

    [Fact]
    public async Task DeleteFriendAsync_ShouldThrowException_WhenFriendshipNotFound()
    {
        // Arrange
        var userId = "user1";
        var friendUserId = "user2";

        // Act & Assert
        await Assert.ThrowsAsync<InvalidOperationException>(
            async () => await _repository.DeleteFriendAsync(userId, friendUserId)
        );
    }

    public void Dispose()
    {
        _context.Database.EnsureDeleted();
        _context.Dispose();
    }
}
}
