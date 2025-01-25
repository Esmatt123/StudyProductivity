

using StudyProductivityApp.Core.Models;

namespace StudyProductivityApp.Core.Graphql.Inputs
{
    public class CreateGroupChatInput
    {
        public string GroupName { get; set; }
        public string CreatorId { get; set; }
        public List<GroupChatMember> InitialFriendIds { get; set; }
    }
}