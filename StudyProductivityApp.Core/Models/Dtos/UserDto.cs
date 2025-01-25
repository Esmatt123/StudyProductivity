namespace StudyProductivityApp.Core.Models.Dtos
{
    public class UserDto
    {
        public string UserId { get; set; } // Unique identifier for the user
        public string Username { get; set; } // The name the user goes by
        public string Email { get; set; } // The user's email address
        public string PasswordHash { get; set; }
        public DateTime CreatedDate { get; set; } // The date the user was created
        public string ProfileImageUrl { get; set; } // URL for the user's profile image
        public List<string> Friends { get; set; } = []; // List of User IDs representing friends
        public List<MeetupEventDto> CreatedEvents { get; set; } = []; // Events created by the user
        public bool IsInvited { get; set; }
        public List<MeetupEventDto> JoinedEvents { get; set; } = []; // Events joined by the user
    }
}
