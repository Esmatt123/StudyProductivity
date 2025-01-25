using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace StudyProductivityApp.Core.Models
{
    public class MeetupEvent
    {
        [Key]
        public string MeetupEventId { get; set; }
        
        [Required]
        public string Title { get; set; }

        public string Description { get; set; }

        [Required]
        public DateTime MeetupDate { get; set; }

        [Required]
        public double Latitude { get; set; }

        [Required]
        public double Longitude { get; set; } // Storing coordinates for the event location

        public string LocationName { get; set; }
        public string Address { get; set; } // Storing the address of the event

        [Required]
        public string CreatedByUserId { get; set; } // Foreign key for the user who created the event

        [ForeignKey("CreatedByUserId")]
        public User CreatedByUser { get; set; } // Navigation property for the user who created the event

        public ICollection<Attendee> Attendees { get; set; } = new List<Attendee>(); // Attendees for the event
    }
}
