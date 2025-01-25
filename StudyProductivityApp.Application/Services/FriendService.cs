using StudyProductivityApp.Core.Interfaces.RepositoryInterfaces;
using StudyProductivityApp.Core.Interfaces.ServiceInterfaces;
using StudyProductivityApp.Core.Models;

namespace StudyProductivityApp.Application.Services
{
    public class FriendService : IFriendService
    {
        private readonly IFriendRepository _friendRepository;

        public FriendService(IFriendRepository friendRepository)
        {
            _friendRepository = friendRepository;
        }

        public async Task<Friend> AddFriendAsync(string userId, string friendUserId)
        {
            return await _friendRepository.AddFriendAsync(userId, friendUserId);
        }

        public async Task DeleteFriendAsync(string userId, string friendUserId)
        {
            await _friendRepository.DeleteFriendAsync(userId, friendUserId);
        }

        public async Task<List<Friend>> GetFriendsAsync(string userId)
        {
            return await _friendRepository.GetFriendsAsync(userId);
        }
    }
}
