namespace StudyProductivityApp.Core.Models.Dtos
{
    public class MessageDto
    {
        public int MessageId { get; set; }
        public string Content { get; set; }
        public string UserId { get; set; }
        public int? ChatRoomId { get; set; }
        public string GroupChatId { get; set; }
        public DateTime SentAt { get; set; }
    }

}