namespace StudyProductivityApp.Core.Models.Dtos
{
    public class DocumentDto
    {
        public string Id { get; set; } // Document ID
        public string Name { get; set; } // Document Name
        public string OwnerId { get; set; } // Add OwnerId to the DTO
        public string SharedUserId { get; set; }
        public List<DocumentShareDto> Shares { get; set; } // To include share info if needed

        public bool CanWrite { get; set; }
        public bool CanRead { get; set; }
        
    }
}