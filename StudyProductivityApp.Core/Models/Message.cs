namespace StudyProductivityApp.Core.Models
{
    public class Message
    {
        public int MessageId { get; set; }

        // This is for private chats
        public int? ChatRoomId { get; set; } // Make it nullable since the message might belong to a group chat
        public ChatRoom ChatRoom { get; set; }

        // This is for group chats
        public string GroupChatId { get; set; } // Use a string (or your preferred type) for group chat ID
        public GroupChat GroupChat { get; set; }

        public string UserId { get; set; }
        public User User { get; set; }

        public string Content { get; set; }
        public DateTime SentAt { get; set; }
        public bool IsQueued { get; set; } = false; // Indicates if it's queued for an offline user
        public bool IsDelivered { get; set; } = false;
    }

}