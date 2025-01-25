using Microsoft.EntityFrameworkCore;
using StudyProductivityApp.Core.Models;
using StudyProductivityApp.Persistence.Repositories;
using StudyProductivityApp.Persistence.Data;
using Moq;
using StudyProductivityApp.Core.Interfaces.ServiceInterfaces;

namespace StudyProductivityApp.Persistence.Tests
{
    public class MessageRepositoryTests
    {
       
    private readonly StudyProductivityDbContext _context;
    private readonly MessageRepository _repository;
    private readonly Mock<IEncryptionService> _encryptionServiceMock;

    public MessageRepositoryTests()
    {
        var options = new DbContextOptionsBuilder<StudyProductivityDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;

        _context = new StudyProductivityDbContext(options);
        _encryptionServiceMock = new Mock<IEncryptionService>();
        
        _repository = new MessageRepository(
            _context,
            _encryptionServiceMock.Object
        );
    }


        // Helper method to seed data
        private async Task SeedDatabase()
        {
            var chatRoom = new ChatRoom
            {
                ChatRoomId = 1,
                RoomName = "Test Chat Room"
            };

            _context.ChatRooms.Add(chatRoom);
            await _context.SaveChangesAsync();

            var messages = new[]
            {
                new Message
                {
                    ChatRoomId = chatRoom.ChatRoomId,
                    UserId = "user1",
                    Content = "Hello, this is the first message.",
                    SentAt = DateTime.UtcNow
                },
                new Message
                {
                    ChatRoomId = chatRoom.ChatRoomId,
                    UserId = "user2",
                    Content = "Hello, this is the second message.",
                    SentAt = DateTime.UtcNow
                }
            };

            _context.Messages.AddRange(messages);
            await _context.SaveChangesAsync();
        }

        [Fact]
        public async Task CreateMessageAsync_ShouldAddMessageToDatabase()
        {
            // Arrange
            var newMessage = new Message
            {
                ChatRoomId = 1,
                UserId = "user3",
                Content = "This is a new message.",
                SentAt = DateTime.UtcNow
            };

            // Act
            var createdMessage = await _repository.CreateMessageAsync(newMessage);

            // Assert
            Assert.NotNull(createdMessage);
            Assert.Equal(newMessage.Content, createdMessage.Content);
            Assert.Equal(1, _context.Messages.Count(m => m.ChatRoomId == newMessage.ChatRoomId));
        }

        [Fact]
public async Task GetMessagesByChatRoomIdAsync_ShouldReturnMessagesForGivenChatRoomId()
{
    // Arrange
    var encryptedContent1 = "EncryptedContent1";
    var encryptedContent2 = "EncryptedContent2";
    var decryptedContent1 = "Hello, this is the first message.";
    var decryptedContent2 = "Hello, this is the second message.";

    // Setup encryption service mock
    _encryptionServiceMock.Setup(e => e.Decrypt(encryptedContent1))
        .Returns(decryptedContent1);
    _encryptionServiceMock.Setup(e => e.Decrypt(encryptedContent2))
        .Returns(decryptedContent2);

    // Add encrypted messages to the database
    var messages = new List<Message>
    {
        new Message
        {
            ChatRoomId = 1,
            UserId = "user1",
            Content = encryptedContent1,
            SentAt = DateTime.UtcNow
        },
        new Message
        {
            ChatRoomId = 1,
            UserId = "user2",
            Content = encryptedContent2,
            SentAt = DateTime.UtcNow.AddMinutes(1)
        }
    };

    await _context.Messages.AddRangeAsync(messages);
    await _context.SaveChangesAsync();

    // Act
    var result = await _repository.GetMessagesByChatRoomIdAsync(1);

    // Assert
    Assert.NotNull(result);
    Assert.Equal(2, result.Count());
    Assert.Contains(result, m => m.UserId == "user1" && m.Content == decryptedContent1);
    Assert.Contains(result, m => m.UserId == "user2" && m.Content == decryptedContent2);

    // Verify encryption service was called for each message
    _encryptionServiceMock.Verify(e => e.Decrypt(encryptedContent1), Times.Once);
    _encryptionServiceMock.Verify(e => e.Decrypt(encryptedContent2), Times.Once);
}

[Fact]
public async Task GetMessagesByChatRoomIdAsync_ShouldHandleDecryptionErrors()
{
    // Arrange
    var encryptedContent = "EncryptedContent";

    // Setup encryption service to throw an exception
    _encryptionServiceMock.Setup(e => e.Decrypt(encryptedContent))
        .Throws(new Exception("Decryption failed"));

    // Add encrypted message to the database
    var message = new Message
    {
        ChatRoomId = 1,
        UserId = "user1",
        Content = encryptedContent,
        SentAt = DateTime.UtcNow
    };

    await _context.Messages.AddAsync(message);
    await _context.SaveChangesAsync();

    // Act & Assert
    await Assert.ThrowsAsync<Exception>(async () => 
        await _repository.GetMessagesByChatRoomIdAsync(1));
}

        [Fact]
        public async Task GetMessagesByChatRoomIdAsync_ShouldReturnEmptyWhenNoMessagesExistForChatRoom()
        {
            // Arrange
            var newChatRoomId = 999; // Assuming no messages exist for this chat room

            // Act
            var messages = await _repository.GetMessagesByChatRoomIdAsync(newChatRoomId);

            // Assert
            Assert.NotNull(messages);
            Assert.Empty(messages);
        }

        public async Task<Message> CreateMessageAsync(Message message)
        {
            if (message == null)
            {
                throw new ArgumentNullException(nameof(message), "Message cannot be null.");
            }

            _context.Messages.Add(message);
            await _context.SaveChangesAsync();
            return message;
        }

        [Fact]
public async Task GetMessagesByChatRoomIdAsync_ShouldReturnMessagesForDifferentChatRooms()
{
    // Arrange
    var encryptedContent1 = "EncryptedContent1";
    var encryptedContent2 = "EncryptedContent2";
    var encryptedContent3 = "EncryptedContent3";
    
    var decryptedContent1 = "Message for chat room 1";
    var decryptedContent2 = "Another message for chat room 1";
    var decryptedContent3 = "Message for new chat room.";

    // Setup encryption service mock
    _encryptionServiceMock.Setup(e => e.Decrypt(encryptedContent1))
        .Returns(decryptedContent1);
    _encryptionServiceMock.Setup(e => e.Decrypt(encryptedContent2))
        .Returns(decryptedContent2);
    _encryptionServiceMock.Setup(e => e.Decrypt(encryptedContent3))
        .Returns(decryptedContent3);

    // Create first chat room with messages
    var chatRoom1 = new ChatRoom
    {
        ChatRoomId = 1,
        RoomName = "Test Chat Room"
    };

    var messages1 = new List<Message>
    {
        new Message
        {
            ChatRoomId = chatRoom1.ChatRoomId,
            UserId = "user1",
            Content = encryptedContent1,
            SentAt = DateTime.UtcNow
        },
        new Message
        {
            ChatRoomId = chatRoom1.ChatRoomId,
            UserId = "user2",
            Content = encryptedContent2,
            SentAt = DateTime.UtcNow.AddMinutes(1)
        }
    };

    // Create second chat room with message
    var chatRoom2 = new ChatRoom
    {
        ChatRoomId = 2,
        RoomName = "Another Test Chat Room"
    };

    var message2 = new Message
    {
        ChatRoomId = chatRoom2.ChatRoomId,
        UserId = "user3",
        Content = encryptedContent3,
        SentAt = DateTime.UtcNow
    };

    // Add all to database
    await _context.ChatRooms.AddRangeAsync(chatRoom1, chatRoom2);
    await _context.Messages.AddRangeAsync(messages1);
    await _context.Messages.AddAsync(message2);
    await _context.SaveChangesAsync();

    // Act
    var result = await _repository.GetMessagesByChatRoomIdAsync(2);

    // Assert
    Assert.NotNull(result);
    Assert.Single(result);
    var retrievedMessage = Assert.Single(result);
    Assert.Equal(decryptedContent3, retrievedMessage.Content);
    Assert.Equal("user3", retrievedMessage.UserId);
    Assert.Equal(2, retrievedMessage.ChatRoomId);

    // Verify encryption service was called only for the second chat room's messages
    _encryptionServiceMock.Verify(e => e.Decrypt(encryptedContent3), Times.Once);
    _encryptionServiceMock.Verify(e => e.Decrypt(encryptedContent1), Times.Never);
    _encryptionServiceMock.Verify(e => e.Decrypt(encryptedContent2), Times.Never);

    // Additional verification: check first chat room messages are not included
    var messages1Result = await _repository.GetMessagesByChatRoomIdAsync(1);
    Assert.Equal(2, messages1Result.Count());
    Assert.Contains(messages1Result, m => m.Content == decryptedContent1);
    Assert.Contains(messages1Result, m => m.Content == decryptedContent2);
}
        [Fact]
        public async Task GetMessagesByChatRoomIdAsync_ShouldThrowInvalidOperationException_WhenChatRoomDoesNotExist()
        {
            // Arrange
            var nonExistentChatRoomId = 999;

            // Act & Assert
            var messages = await _repository.GetMessagesByChatRoomIdAsync(nonExistentChatRoomId);
            Assert.Empty(messages);
        }
    }
}
