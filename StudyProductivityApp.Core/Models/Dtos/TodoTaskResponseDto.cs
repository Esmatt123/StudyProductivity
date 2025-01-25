namespace StudyProductivityApp.Core.Models.Dtos
{
        public class TodoTaskResponseDto
    {
        public int TodoTaskId { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public bool IsCompleted { get; set; }
        public string CreatedDateFormatted { get; set; }
        public string DueDateFormatted { get; set; }
    }
}