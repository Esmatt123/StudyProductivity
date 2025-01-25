namespace StudyProductivityApp.Core.Models.Dtos
{
    public class AttendeeDto
    {
        public string UserId { get; set; }
        public string EventId { get; set; }
        public UserDto User { get; set; } // Assuming you have a UserDto to represent the user details
        public string Username { get; set; }
    }

}