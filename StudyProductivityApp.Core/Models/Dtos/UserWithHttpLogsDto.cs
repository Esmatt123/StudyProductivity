namespace StudyProductivityApp.Core.Models.Dtos
{
    public class UserWithHttpLogsDto
    {
        public int UserId { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }

        // Only include the necessary fields
        public List<HttpRequestLogDto> HttpRequestLogs { get; set; }
    }
}