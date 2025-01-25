using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using StudyProductivityApp.Core.Models;

namespace StudyProductivityApp.Core.Interfaces.RepositoryInterfaces
{
    public interface IFriendRepository
    {
        Task<Friend> AddFriendAsync(string userId, string friendUserId);

        Task<List<Friend>> GetFriendsAsync(string userId);

        Task DeleteFriendAsync(string userId, string friendUserId);
    }
}