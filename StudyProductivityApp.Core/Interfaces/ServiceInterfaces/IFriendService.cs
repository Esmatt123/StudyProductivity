using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using StudyProductivityApp.Core.Models;

namespace StudyProductivityApp.Core.Interfaces.ServiceInterfaces
{
    public interface IFriendService
    {
        Task<Friend> AddFriendAsync(string userId, string friendUserId);

        Task<List<Friend>> GetFriendsAsync(string userId);

        Task DeleteFriendAsync(string userId, string friendUserId);
    }
}