using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace StudyProductivityApp.Core.Graphql.Inputs
{
    public class UpdateTodoTaskInput
    {
        public int TodoTaskId { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public bool IsCompleted { get; set; }
        public DateTime? DueDate { get; set; }
        public int Position { get; set; }
        public int TodoTaskListId { get; set; }
        public string UserId { get; set; }
    }

}