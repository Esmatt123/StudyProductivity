namespace StudyProductivityApp.Core.Models
{
    public class DocumentShare
{
    public string Id { get; set; } // Unique identifier for the share

    // The ID of the document that is shared
    public string DocumentId { get; set; }
    public Document Document { get; set; }

    // The email or user ID of the shared user
    public string UserId { get; set; } // For email invitation or internal user management

    // Permissions
    public bool CanRead { get; set; } = false;  // Can the user read the document
    public bool CanWrite { get; set; } = false; // Can the user edit the document

     public string SharedByUserId { get; set; } // Add this field

     public string Email { get; set; }
}

}
