using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace StudyProductivityApp.Core.Models
{
    public class TodoTaskList
    {
        public int TodoTaskListId { get; set; }

        // Name of the task list
        public string Name { get; set; }

        // Position of the list among other lists (for ordering)
        public int Position { get; set; }

        // Foreign key relationship to User
        public string UserId { get; set; }

        [JsonIgnore]
        public User User { get; set; }

        // Collection of TodoTasks in this list
        public ICollection<TodoTask> TodoTasks { get; set; }
    }
}