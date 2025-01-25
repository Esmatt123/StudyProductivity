using System.Text.Json.Serialization;

namespace StudyProductivityApp.Core.Models
{
    public class TodoTask
    {
        public int TodoTaskId { get; set; }

        public string Title { get; set; }

        public string Description { get; set; }

        public bool IsCompleted { get; set; }

        public DateTime CreatedDate { get; set; }

        public DateTime? DueDate { get; set; }

        // New property: Position of the task within the list
        public int Position { get; set; }

        // New foreign key relationship to TodoTaskList
        public int TodoTaskListId { get; set; }

        [JsonIgnore]
        public TodoTaskList TodoTaskList { get; set; }

        // Existing foreign key relationship to User
        public string UserId { get; set; }

        [JsonIgnore]
        public User User { get; set; }
    }
}
