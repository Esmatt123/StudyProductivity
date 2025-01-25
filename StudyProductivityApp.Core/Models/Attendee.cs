using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace StudyProductivityApp.Core.Models
{
    public class Attendee
    {
        [Key]
        public string Id { get; set; } // Primary key for the attendee entry

        [Required]
        public string UserId { get; set; } // Foreign key to the user table

        [ForeignKey("UserId")]
        public User User { get; set; } // Navigation property for the user

        [Required]
        public string EventId { get; set; } // Foreign key to the event table

        [ForeignKey("EventId")]
        public MeetupEvent Event { get; set; }

        public string Username { get; set; } // Username of the attendee
    }
}