namespace StudyProductivityApp.Core.Models.Dtos
{
    public class ChatRoomDto
    {
        public int ChatRoomId { get; set; }
        public string RoomName { get; set; } // For group chats
        public bool IsGroupChat { get; set; }
        public List<ChatParticipantDto> ChatParticipants { get; set; }
        public List<MessageDto> Messages { get; set; }
    }
}