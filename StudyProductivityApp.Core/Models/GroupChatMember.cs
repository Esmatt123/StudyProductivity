namespace StudyProductivityApp.Core.Models
{
    public class GroupChatMember
    {
        public string GroupChatId { get; set; } // Foreign key for GroupChat
        public GroupChat GroupChat { get; set; } // Navigation property for GroupChat
        public string UserId { get; set; } // Foreign key for User
        public User User { get; set; } // Navigation property for User
        public string Username { get; set; } 
        
    }

}