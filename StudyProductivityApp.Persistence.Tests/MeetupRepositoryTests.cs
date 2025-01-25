using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using StudyProductivityApp.Core.Models;
using StudyProductivityApp.Persistence.Data;
using StudyProductivityApp.Persistence.Repositories;

namespace StudyProductivityApp.Persistence.Tests
{
    public class MeetupRepositoryTests
    {
        private readonly StudyProductivityDbContext _context;
        private readonly MeetupRepository _repository;

        public MeetupRepositoryTests()
        {
            // Setup in-memory database for testing
            var options = new DbContextOptionsBuilder<StudyProductivityDbContext>()
    .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
    .EnableSensitiveDataLogging()
    .LogTo(Console.WriteLine, LogLevel.Information)
    .Options;

            _context = new StudyProductivityDbContext(options);
            _repository = new MeetupRepository(_context);
        }

        [Fact]
        public async Task CreateMeetupAsync_ShouldCreateMeetup()
        {
            // Arrange
            var userId = "user1";
            var meetupDate = DateTime.Now.AddDays(1).ToString("yyyy-MM-dd");
            var location = "Test Location";
            var address = "Test Address";

            // Act
            var meetupEvent = await _repository.CreateMeetupAsync("Test Meetup", "Test Description", meetupDate, location, address, userId, 50.0, 50.0);

            // Assert
            Assert.NotNull(meetupEvent);
            Assert.Equal("Test Meetup", meetupEvent.Title);
            Assert.Equal(userId, meetupEvent.CreatedByUserId);
            Assert.Equal(location, meetupEvent.LocationName);
            Assert.Equal(address, meetupEvent.Address);
        }

        [Fact]
        public async Task GetMeetupByIdAsync_ShouldReturnMeetup()
        {
            // Arrange
            var userId = "user1";
            var meetupEvent = await _repository.CreateMeetupAsync(
                "Test Meetup",
                "Test Description",
                DateTime.Now.AddDays(1).ToString("yyyy-MM-dd"),
                "Location",
                "Address",
                userId,
                50.0,
                50.0);

            // Act
            var retrievedMeetup = await _repository.GetMeetupByIdAsync(meetupEvent.MeetupEventId);

            // Assert
            Assert.NotNull(retrievedMeetup);
            Assert.Equal(meetupEvent.MeetupEventId, retrievedMeetup.MeetupEventId);
        }

        // Update other test methods similarly


        [Fact]
        public async Task UpdateMeetupAsync_ShouldUpdateMeetup()
        {
            // Arrange
            var userId = "user1";
            var meetupEvent = await _repository.CreateMeetupAsync("Test Meetup", "Test Description", DateTime.Now.AddDays(1).ToString("yyyy-MM-dd"), "Location", "Address", userId, 50.0, 50.0);

            meetupEvent.Title = "Updated Meetup";
            meetupEvent.Description = "Updated Description";

            // Act
            await _repository.UpdateMeetupAsync(meetupEvent);
            var updatedMeetup = await _repository.GetMeetupByIdAsync(meetupEvent.MeetupEventId);

            // Assert
            Assert.NotNull(updatedMeetup);
            Assert.Equal("Updated Meetup", updatedMeetup.Title);
            Assert.Equal("Updated Description", updatedMeetup.Description);
        }

        [Fact]
        public async Task DeleteMeetupAsync_ShouldDeleteMeetup()
        {
            // Arrange
            var userId = "user1";
            var meetupEvent = await _repository.CreateMeetupAsync("Test Meetup", "Test Description", DateTime.Now.AddDays(1).ToString("yyyy-MM-dd"), "Location", "Address", userId, 50.0, 50.0);

            // Act
            await _repository.DeleteMeetupAsync(meetupEvent.MeetupEventId, userId);
            var deletedMeetup = await _repository.GetMeetupByIdAsync(meetupEvent.MeetupEventId);

            // Assert
            Assert.Null(deletedMeetup);
        }

        [Fact]
        public async Task ToggleAttendanceAsync_ShouldAddAttendeeIfNotExist()
        {
            // Arrange
            var userId = "user1";
            var meetupEvent = await _repository.CreateMeetupAsync("Test Meetup", "Test Description", DateTime.Now.AddDays(1).ToString("yyyy-MM-dd"), "Location", "Address", userId, 50.0, 50.0);

            // Act
            await _repository.ToggleAttendanceAsync(meetupEvent.MeetupEventId, userId);
            var meetup = await _repository.GetMeetupByIdAsync(meetupEvent.MeetupEventId);

            // Assert
            Assert.Contains(meetup.Attendees, a => a.UserId == userId);
        }

        [Fact]
        public async Task ToggleAttendanceAsync_ShouldRemoveAttendeeIfExist()
        {
            // Arrange
            var userId = "user1";
            var meetupEvent = await _repository.CreateMeetupAsync("Test Meetup", "Test Description", DateTime.Now.AddDays(1).ToString("yyyy-MM-dd"), "Location", "Address", userId, 50.0, 50.0);

            // Add attendee
            await _repository.ToggleAttendanceAsync(meetupEvent.MeetupEventId, userId);

            // Act
            await _repository.ToggleAttendanceAsync(meetupEvent.MeetupEventId, userId);
            var meetup = await _repository.GetMeetupByIdAsync(meetupEvent.MeetupEventId);

            // Assert
            Assert.DoesNotContain(meetup.Attendees, a => a.UserId == userId);
        }

       [Fact]
public async Task GetAllMeetupsAsync_ShouldReturnUserAndFriendsMeetups()
{
    // Arrange
    var userId = "user1";
    var friendUserId = "user2";

    // Seed users
    var user1 = new User
    {
        UserId = userId,
        Username = "User One",
        Email = "user1@example.com"
    };
    var user2 = new User
    {
        UserId = friendUserId,
        Username = "User Two",
        Email = "user2@example.com"
    };
    _context.Users.AddRange(user1, user2);
    await _context.SaveChangesAsync();

    // Create meetups
    var userMeetup = await _repository.CreateMeetupAsync("User Meetup", "Test Description",
        DateTime.Now.AddDays(1).ToString("yyyy-MM-dd"), "Location", "Address", userId, 50.0, 50.0);
    var friendMeetup = await _repository.CreateMeetupAsync("Friend Meetup", "Test Description",
        DateTime.Now.AddDays(1).ToString("yyyy-MM-dd"), "Location", "Address", friendUserId, 50.0, 50.0);

    // Create friendship
    var friend = new Friend
    {
        FriendId = Guid.NewGuid().ToString(),
        UserId = userId,
        FriendUserId = friendUserId
    };
    _context.Friends.Add(friend);
    await _context.SaveChangesAsync();

    // Act
    var meetups = await _repository.GetAllMeetupsAsync(userId);

    // Debug the result
    Console.WriteLine($"Meetups count: {meetups.Count()}");
    foreach (var meetup in meetups)
    {
        Console.WriteLine($"Meetup ID: {meetup.MeetupEventId}, Name: {meetup.Title}, Created By: {meetup.CreatedByUserId}");
    }

    // Assert
    Assert.NotEmpty(meetups);
    Assert.Contains(meetups, m => m.MeetupEventId == userMeetup.MeetupEventId);
    Assert.Contains(meetups, m => m.MeetupEventId == friendMeetup.MeetupEventId);
}



        [Fact]
        public async Task GetAllMeetupsAsync_ShouldReturnEmptyIfNoFriends()
        {
            // Arrange
            var userId = "user1";

            // Act
            var meetups = await _repository.GetAllMeetupsAsync(userId);

            // Assert
            Assert.Empty(meetups);
        }
    }
}
