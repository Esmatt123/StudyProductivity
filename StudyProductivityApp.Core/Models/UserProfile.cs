using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace StudyProductivityApp.Core.Models
{
    public class UserProfile
    {
        [Key]
        public int UserProfileId { get; set; }
        
        [Required]
        public string UserId { get; set; } // Foreign key reference to User
        
        public string ProfileImageUrl { get; set; } // Placeholder for blob storage URL

        public string Bio { get; set; }
        
        [ForeignKey("UserId")]
        public User User { get; set; } // Navigation property for the user
    }
}
