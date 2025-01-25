using System.Text.Json.Serialization;

namespace StudyProductivityApp.Core.Models
{
    public class ChatParticipant
    {
        public string ChatParticipantId { get; set; }
        public string UserId { get; set; }
        public int ChatRoomId { get; set; }
        [JsonIgnore] 
        public User User { get; set; }
        [JsonIgnore] 
        public ChatRoom ChatRoom { get; set; }
    }
}