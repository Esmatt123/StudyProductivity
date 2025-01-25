using StudyProductivityApp.Core.Models;

namespace StudyProductivityApp.Core.Interfaces.ServiceInterfaces
{
    public interface IMeetupService
    {
        Task<MeetupEvent> CreateMeetupAsync(string Title, string Description, string MeetupDate, string LocationName, string Address, string CreatedByUserId, double Latitude, double Longitude);
        Task<MeetupEvent> GetMeetupByIdAsync(string meetupId);
        Task UpdateMeetupAsync(MeetupEvent meetup);
        Task DeleteMeetupAsync(string meetupEventId, string userId);
        Task<IEnumerable<MeetupEvent>> GetAllMeetupsAsync(string userId);
        Task ToggleAttendanceAsync(string meetupEventId, string userId);
        
    }
}