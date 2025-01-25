using System.ComponentModel.DataAnnotations;

namespace StudyProductivityApp.Core.Models
{
    public class Friend
    {
        [Key]
        public string FriendId { get; set; } // Primary Key

        public string UserId { get; set; } // The user who sent the friend request
        public string FriendUserId { get; set; } // The user who accepted the friend request

        // Navigation properties
        public User User { get; set; } // The user who sent the request
        public User FriendUser { get; set; } // The user who received the request
    }

}
