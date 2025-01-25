using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace StudyProductivityApp.Core.Graphql.Inputs
{
    public class DeleteAllMessagesInput
    {
        public object ChatId { get; set; }
        public bool IsGroupChat { get; set; }
    }
}