using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using StudyProductivityApp.Core.Models.Dtos;

namespace StudyProductivityApp.Core.Interfaces.ServiceInterfaces
{
    public interface IComplaintService
    {
        Task<int> GetTotalComplaintsAsync();

        Task<List<ComplaintDto>> GetAllComplaintsAsync();

        Task AddComplaintAsync(ComplaintDto complaintDto);

        
    }
}