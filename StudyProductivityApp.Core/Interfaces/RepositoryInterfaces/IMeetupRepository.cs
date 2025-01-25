using StudyProductivityApp.Core.Models;

namespace StudyProductivityApp.Core.Interfaces.RepositoryInterfaces
{
    public interface IMeetupRepository
    {
        Task<MeetupEvent> CreateMeetupAsync(string Title, string Description, string MeetupDate, string LocationName, string Address, string CreatedByUserId, double Latitude, double Longitude);
        Task<MeetupEvent> GetMeetupByIdAsync(string meetupId);
        Task<IEnumerable<MeetupEvent>> GetAllMeetupsAsync(string userId);
        Task UpdateMeetupAsync(MeetupEvent meetup);
        Task DeleteMeetupAsync(string meetupEventId, string userId);

        Task ToggleAttendanceAsync(string meetupEventId, string userId);
    }
}