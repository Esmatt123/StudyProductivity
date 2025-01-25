using System.ComponentModel.DataAnnotations.Schema;

namespace StudyProductivityApp.Core.Models
{
    public class UserFile
    {
        public int UserFileId { get; set; }
        public string FileName { get; set; } // File name including extension
        public string FilePath { get; set; } // Full path to the file storage location
        public long FileSize { get; set; } // File size in bytes
        public string FileType { get; set; } // MIME type (e.g., "audio/mp3", "image/png", "video/mp4")
        public DateTime UploadDate { get; set; } // Date and time when the file was uploaded
        public string UploadedByUserId { get; set; } // ID of the user who uploaded the file
        public string ThumbnailPath { get; set; }
        public string SasUri { get; set; }

        // Navigation properties
        public User? UploadedByUser { get; set; } // Reference to the uploading user
        public ICollection<UserFileAccess> UserFileAccesses { get; set; } // Access details for the file

        // Folder association
        [ForeignKey("FolderId")]
        public int? FolderId { get; set; } // Nullable to allow root-level files
        public Folder? Folder { get; set; } // Navigation property for the folder containing this file
    }


}
