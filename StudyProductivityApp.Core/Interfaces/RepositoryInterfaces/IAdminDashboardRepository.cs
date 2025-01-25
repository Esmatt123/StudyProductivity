using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using StudyProductivityApp.Core.Models;

namespace StudyProductivityApp.Core.Interfaces.RepositoryInterfaces
{
    public interface IAdminDashboardRepository
    {
        Task<int> GetTotalComplaintsAsync();
        Task<int> GetTotalTasksCreatedAsync();
        Task<int> GetTotalHttpRequestsAsync(); // This might need custom implementation to track
        Task<IEnumerable<UserActivity>> GetUserActivitiesAsync();
    }
}