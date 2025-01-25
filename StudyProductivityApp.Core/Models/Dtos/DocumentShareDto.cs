namespace StudyProductivityApp.Core.Models.Dtos
{
    public class DocumentShareDto
    {
        public string UserId { get; set; }
        public bool CanRead { get; set; }
        public bool CanWrite { get; set; }
        public string SharedByUserId { get; set; } // New field to track who shared the document
        public string Email { get; set; }
    }

}