using Microsoft.EntityFrameworkCore;
using StudyProductivityApp.Core.Interfaces.RepositoryInterfaces;
using StudyProductivityApp.Core.Models;
using StudyProductivityApp.Persistence.Data;

namespace StudyProductivityApp.Persistence.Repositories
{
    public class FriendRepository : IFriendRepository
    {
        private readonly StudyProductivityDbContext _context;

        public FriendRepository(StudyProductivityDbContext context)
        {
            _context = context;
        }

        public async Task<Friend> AddFriendAsync(string userId, string friendUserId)
{
    // Check if the friend relationship already exists
    var existingFriendship = await _context.Friends
        .AnyAsync(f => (f.UserId == userId && f.FriendUserId == friendUserId) ||
                       (f.UserId == friendUserId && f.FriendUserId == userId));

    // Debugging: Log existing friendships
    Console.WriteLine($"Checking friendship between {userId} and {friendUserId}. Exists: {existingFriendship}");

    // If the friendship already exists, throw an exception or return null
    if (existingFriendship)
    {
        throw new InvalidOperationException("Friendship already exists between these users.");
    }

    // If no friendship exists, create new friend relationships for both users
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

    // Add the new friend relationships
    _context.Friends.Add(friend1);
    _context.Friends.Add(friend2);
    await _context.SaveChangesAsync();

    return friend1;
}



        public async Task<List<Friend>> GetFriendsAsync(string userId)
        {
            return await _context.Friends
                .Where(f => f.UserId == userId)
                .Include(f => f.FriendUser) // Ensure we load the FriendUser relationship
                .ToListAsync();
        }

        public async Task DeleteFriendAsync(string userId, string friendUserId)
        {
            // Find the friendships for both users
            var friendship1 = await _context.Friends
                .FirstOrDefaultAsync(f => f.UserId == userId && f.FriendUserId == friendUserId);

            var friendship2 = await _context.Friends
                .FirstOrDefaultAsync(f => f.UserId == friendUserId && f.FriendUserId == userId);

            // Check if friendships exist
            if (friendship1 == null && friendship2 == null)
            {
                throw new InvalidOperationException("Friendship not found between these users.");
            }

            // Remove the friendships
            if (friendship1 != null)
            {
                _context.Friends.Remove(friendship1);
            }

            if (friendship2 != null)
            {
                _context.Friends.Remove(friendship2);
            }

            // Save changes to the database
            await _context.SaveChangesAsync();
        }

    }
}
