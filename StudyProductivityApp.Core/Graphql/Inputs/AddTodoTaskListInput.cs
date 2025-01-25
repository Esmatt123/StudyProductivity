using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace StudyProductivityApp.Core.Graphql.Inputs
{
    public class AddTodoTaskListInput
    {
        public string Name { get; set; }
        public int Position { get; set; }
        public string UserId { get; set; }
    }
}