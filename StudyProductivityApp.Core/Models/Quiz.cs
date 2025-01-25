namespace StudyProductivityApp.Core.Models
{
    public class Quiz
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string UserId { get; set; } // New property for user association
        public ICollection<Question> Questions { get; set; } = new List<Question>();
    }
}
