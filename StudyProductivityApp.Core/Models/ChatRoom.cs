using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace StudyProductivityApp.Core.Models
{
    public class ChatRoom
    {
        public int ChatRoomId { get; set; }
        public string RoomName { get; set; } // For group chats
        public bool IsGroupChat { get; set; }
        public ICollection<ChatParticipant> ChatParticipants { get; set; }
        [JsonIgnore]
        public ICollection<Message> Messages { get; set; }
    }
}