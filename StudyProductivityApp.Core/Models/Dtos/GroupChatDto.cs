using StudyProductivityApp.Core.Models;

namespace StudyProductivityApp.Core.Models.Dtos
{
    public class GroupChatDto
    {
        public string Id { get; set; }
        public string GroupName { get; set; }
        public string CreatorId { get; set; }
        public DateTime CreatedAt { get; set; }
        public List<GroupChatMember> Members { get; set; } = new List<GroupChatMember>();
        public List<MessageDto> Messages { get; set; } = new List<MessageDto>();
    }
}