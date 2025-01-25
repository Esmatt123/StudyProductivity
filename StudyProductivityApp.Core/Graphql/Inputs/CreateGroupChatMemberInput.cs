using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace StudyProductivityApp.Core.Graphql.Inputs
{
    public class GroupChatMemberInput
{
    public string UserId { get; set; } // Only include UserId for creating a group chat
}
}