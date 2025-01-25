using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace StudyProductivityApp.Core.Models
{
    public class GroupChat
    {
        public string Id { get; set; } = Guid.NewGuid().ToString(); // Group chat ID
        public string GroupName { get; set; } // Name of the group chat
        public string CreatorId { get; set; } // User ID of the creator
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow; // When the group was created

        // Navigation properties
        public ICollection<GroupChatMember> Members { get; set; } // Collection of group members
        public ICollection<Message> Messages { get; set; } // Collection of messages associated with this group chat
        public bool IsGroupChat { get; set; } = true;
    }


}