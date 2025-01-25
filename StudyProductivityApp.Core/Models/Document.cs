namespace StudyProductivityApp.Core.Models
{
    public class Document
    {
        public string Id { get; set; } // UUID for the document
        public string Name { get; set; } // Document name
        public string Data { get; set; } // The document content
        // The user who created the document
        public string OwnerId { get; set; }
        public User Owner { get; set; }

        public bool CanRead { get; set; }

        // A collection to store shared users with specific permissions
        public ICollection<DocumentShare> Shares { get; set; } = [];
    }

}