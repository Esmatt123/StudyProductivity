using StudyProductivityApp.Core.Models;

namespace StudyProductivityApp.Core.Models.Dtos
{
    public class MeetupEventDto
    {
        public string MeetupEventId { get; set; } // Unique identifier for the event
        public string Title { get; set; }
        public string Description { get; set; }
        public DateTime MeetupDate { get; set; }
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        public string CreatedByUserId { get; set; } // ID of the user who created the event
        public string LocationName { get; set; } // Optional field for the name of the location
        public string Address { get; set; } // Optional field for the event address
        public ICollection<Attendee> Attendees { get; set; } = new List<Attendee>(); // Attendees for the event
    }
}
