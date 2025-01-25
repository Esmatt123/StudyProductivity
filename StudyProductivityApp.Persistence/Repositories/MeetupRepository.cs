using Microsoft.EntityFrameworkCore;
using StudyProductivityApp.Core.Interfaces.RepositoryInterfaces;
using StudyProductivityApp.Core.Models;
using StudyProductivityApp.Persistence.Data;
using System.Globalization;

namespace StudyProductivityApp.Persistence.Repositories
{
    public class MeetupRepository : IMeetupRepository
    {
        private readonly StudyProductivityDbContext _context;

        public MeetupRepository(StudyProductivityDbContext context)
        {
            _context = context;
        }

        public async Task<MeetupEvent> CreateMeetupAsync(string Title, string Description, string MeetupDate, string LocationName, string Address, string CreatedByUserId, double Latitude, double Longitude)
        {
            // Convert the ISO 8601 date string to a DateTime object
            DateTime meetupDateTime = DateTime.Parse(MeetupDate, new CultureInfo("sv-SE"));

            // Generate a new MeetupEventId
            var newMeetupEventId = Guid.NewGuid().ToString(); // Generate a unique ID for the event

            // Map the input data to the MeetupEvent entity
            var newMeetupEvent = new MeetupEvent
            {
                MeetupEventId = newMeetupEventId, // Assign the generated ID
                Title = Title,
                Description = Description,
                MeetupDate = meetupDateTime, // Assign the converted DateTime
                LocationName = LocationName,
                Address = Address,
                Latitude = Latitude,
                Longitude = Longitude,
                CreatedByUserId = CreatedByUserId,
            };

            // Add the new event to the context
            _context.MeetupEvents.Add(newMeetupEvent);

            // Save the changes to the database
            await _context.SaveChangesAsync();

            // Return the created event
            return newMeetupEvent;
        }



        public async Task<MeetupEvent> GetMeetupByIdAsync(string meetupId)
        {
            var meetup = await _context.MeetupEvents.FindAsync(meetupId);
            return meetup;
        }


        public async Task UpdateMeetupAsync(MeetupEvent meetup)
        {
            _context.MeetupEvents.Update(meetup);
            await _context.SaveChangesAsync();
        }



        public async Task<IEnumerable<MeetupEvent>> GetAllMeetupsAsync(string userId)
        {
            // Get the list of user IDs who are friends with the current user
            var friends = await _context.Friends
                .Where(f => f.UserId == userId || f.FriendUserId == userId) // Find all related friendships
                .Select(f => f.UserId == userId ? f.FriendUserId : f.UserId) // Get the friend's userId
                .ToListAsync();

            // Only include meetups created by friends (and optionally, the user themselves)
            if (friends.Count != 0)
            {
                friends.Add(userId); // Optionally include the current user's own meetups

                // Fetch meetups created by the user or their friends
                var meetups = await _context.MeetupEvents
                    .Where(me => friends.Contains(me.CreatedByUserId)) // Only include meetups created by the user or their friends
                    .Include(me => me.CreatedByUser) // Optionally include the user who created the meetup
                    .Include(me => me.Attendees) // Include the attendees
                        .ThenInclude(a => a.User) // Optionally include the user details of attendees
                    .ToListAsync();

                return meetups;
            }
            else
            {
                // If no friends are found, return an empty list (or handle it based on your use case)
                return [];
            }
        }

        public async Task DeleteMeetupAsync(string meetupEventId, string userId)
        {
            // Find the meetup by its ID
            var meetup = await _context.MeetupEvents.FirstOrDefaultAsync(m => m.MeetupEventId == meetupEventId);

            // Check if the meetup exists and if the user is the creator of the meetup
            if (meetup == null)
            {
                throw new Exception("Meetup not found.");
            }

            if (meetup.CreatedByUserId != userId)
            {
                throw new UnauthorizedAccessException("You are not authorized to delete this meetup.");
            }

            // If the meetup exists and the user is authorized, remove it
            _context.MeetupEvents.Remove(meetup);

            // Save the changes to the database
            await _context.SaveChangesAsync();
        }

        public async Task ToggleAttendanceAsync(string meetupEventId, string userId)
        {
            // Find the meetup by its ID
            var meetup = await _context.MeetupEvents
                .Include(m => m.Attendees) // Include attendees to check if the user already attended
                .FirstOrDefaultAsync(m => m.MeetupEventId == meetupEventId);

            if (meetup == null)
            {
                throw new Exception("Meetup not found.");
            }

            // Find the attendee if they exist
            var attendee = meetup.Attendees.FirstOrDefault(a => a.UserId == userId);

            if (attendee != null)
            {
                // If the user is already attending, remove them (i.e., cancel attendance)
                meetup.Attendees.Remove(attendee);
            }
            else
            {
                // If the user is not attending, add them as an attendee
                var user = await _context.Users.FindAsync(userId); // Fetch the user to get the username
                attendee = new Attendee
                {
                    Id = Guid.NewGuid().ToString(), // Generate a new unique ID
                    UserId = userId,
                    EventId = meetupEventId, // Set the EventId directly
                    Username = user?.Username // Set the Username property
                };
                meetup.Attendees.Add(attendee);
            }

            await _context.SaveChangesAsync();
        }






    }
}
