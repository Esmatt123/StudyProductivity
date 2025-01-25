using StudyProductivityApp.Core.Interfaces.RepositoryInterfaces;
using StudyProductivityApp.Core.Interfaces.ServiceInterfaces;
using StudyProductivityApp.Core.Models;

namespace StudyProductivityApp.Application.Services
{
    public class MeetupService : IMeetupService
    {
        private readonly IMeetupRepository _meetupRepository;

        public MeetupService(IMeetupRepository meetupRepository)
        {
            _meetupRepository = meetupRepository;
        }

        public async Task<MeetupEvent> CreateMeetupAsync(string Title, string Description, string MeetupDate, string LocationName, string Address, string CreatedByUserId, double Latitude, double Longitude)
        {
            return await _meetupRepository.CreateMeetupAsync(Title, Description, MeetupDate, LocationName, Address, CreatedByUserId, Latitude, Longitude);
        }

        public async Task<MeetupEvent> GetMeetupByIdAsync(string meetupEventId)
        {
            return await _meetupRepository.GetMeetupByIdAsync(meetupEventId);
        }

        public async Task UpdateMeetupAsync(MeetupEvent meetupEvent)
        {
            await _meetupRepository.UpdateMeetupAsync(meetupEvent);
        }

        public async Task DeleteMeetupAsync(string meetupEventId, string userId)
        {
            await _meetupRepository.DeleteMeetupAsync(meetupEventId, userId);
        }

        public async Task<IEnumerable<MeetupEvent>> GetAllMeetupsAsync(string userId)
        {
            return await _meetupRepository.GetAllMeetupsAsync(userId);
        }

        public async Task ToggleAttendanceAsync(string meetupEventId, string userId)
        {
            await _meetupRepository.ToggleAttendanceAsync(meetupEventId, userId);
        }
    }
}
