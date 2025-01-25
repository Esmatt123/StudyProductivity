using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace StudyProductivityApp.Core.Models
{
    public class UserActivity
    {
        public int UserActivityId { get; set; }
        public string UserId { get; set; }
        public string ActivityType { get; set; } // e.g., "Page Visit", "Task Created"
        public DateTime Timestamp { get; set; }
        public User User { get; set; }
    }

}