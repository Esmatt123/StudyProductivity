using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Logging.Abstractions;
using Moq;
using StudyProductivityApp.Core.Interfaces.ServiceInterfaces;
using StudyProductivityApp.Core.Models;
using StudyProductivityApp.Persistence.Data;
using StudyProductivityApp.Persistence.Repositories;
namespace StudyProductivityApp.Persistence.Tests
{
    public class ChatRoomRepositoryTests
    {
        private readonly StudyProductivityDbContext _context;
        private readonly Mock<ILogger<ChatRoomRepository>> _loggerMock;
        private readonly Mock<IEncryptionService> _encryptionServiceMock;
        private readonly ChatRoomRepository _repository;

        public ChatRoomRepositoryTests()
        {
            // Set up an in-memory database
            var options = new DbContextOptionsBuilder<StudyProductivityDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            _context = new StudyProductivityDbContext(options);
            _loggerMock = new Mock<ILogger<ChatRoomRepository>>();
            _encryptionServiceMock = new Mock<IEncryptionService>();

            _repository = new ChatRoomRepository(
                _context,
                _loggerMock.Object,
                _encryptionServiceMock.Object
            );

            // Seed initial data if necessary
            SeedDatabase();
        }

        private void SeedDatabase()
        {
            // Add any necessary seed data for tests
            _context.Users.AddRange(
                new User { UserId = "User1", Username = "Alice" },
                new User { UserId = "User2", Username = "Bob" },
                new User { UserId = "User3", Username = "Charlie" }
            );

            _context.SaveChanges();
        }


        [Fact]
        public async Task CreateChatRoomAsync_Should_CreateChatRoom_WithParticipants()
        {
            // Arrange
            var options = new DbContextOptionsBuilder<StudyProductivityDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            await using var context = new StudyProductivityDbContext(options);
            var mockEncryptionService = new Mock<IEncryptionService>();

            var repository = new ChatRoomRepository(
                context,
                NullLogger<ChatRoomRepository>.Instance,
                mockEncryptionService.Object
            );

            var chatRoom = new ChatRoom { RoomName = "Test Room", IsGroupChat = true };
            var userIds = new List<string> { "user1", "user2" };

            // Act
            var createdChatRoom = await repository.CreateChatRoomAsync(chatRoom, userIds);

            // Assert
            Assert.NotNull(createdChatRoom);
            Assert.Equal("Test Room", createdChatRoom.RoomName);
            Assert.True(createdChatRoom.ChatParticipants.Count == userIds.Count);
            Assert.All(createdChatRoom.ChatParticipants, cp => Assert.Contains(cp.UserId, userIds));
        }
        [Fact]
        public async Task GetIsGroupChatAsync_Should_ReturnTrue_IfChatRoomIsGroupChat()
        {
            // Arrange
            var options = new DbContextOptionsBuilder<StudyProductivityDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            await using var context = new StudyProductivityDbContext(options);
            var mockEncryptionService = new Mock<IEncryptionService>();

            var repository = new ChatRoomRepository(
                context,
                NullLogger<ChatRoomRepository>.Instance,
                mockEncryptionService.Object
            );

            context.ChatRooms.Add(new ChatRoom { ChatRoomId = 1, RoomName = "Test Group", IsGroupChat = true });
            await context.SaveChangesAsync();

            // Act
            var result = await repository.GetIsGroupChatAsync(1);

            // Assert
            Assert.True(result);
        }
        [Fact]
        public async Task GetUserChatRoomsAsync_Should_ReturnChatRooms_BetweenTwoUsers()
        {
            // Arrange
            var options = new DbContextOptionsBuilder<StudyProductivityDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            await using var context = new StudyProductivityDbContext(options);
            var mockEncryptionService = new Mock<IEncryptionService>();

            var repository = new ChatRoomRepository(
                context,
                NullLogger<ChatRoomRepository>.Instance,
                mockEncryptionService.Object
            );

            // Define a new chat room with participants
            var chatRoom = new ChatRoom
            {
                RoomName = "Chat Room 1",
                ChatParticipants = new List<ChatParticipant>
        {
            new ChatParticipant { UserId = "user1" },
            new ChatParticipant { UserId = "user2" }
        }
            };

            // Manually set the primary key for each ChatParticipant
            foreach (var participant in chatRoom.ChatParticipants)
            {
                participant.ChatParticipantId = Guid.NewGuid().ToString();
            }

            // Add the chat room and participants to the context
            context.ChatRooms.Add(chatRoom);
            await context.SaveChangesAsync();

            // Act
            var chatRooms = await repository.GetUserChatRoomsAsync("user1", "user2");

            // Assert
            Assert.Single(chatRooms);
            Assert.Equal("Chat Room 1", chatRooms.First().RoomName);
        }
        [Fact]
        public async Task CreateGroupChatAsync_Should_CreateGroupChat_WithInitialMembers()
        {
            // Arrange
            var options = new DbContextOptionsBuilder<StudyProductivityDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            await using var context = new StudyProductivityDbContext(options);
            var mockEncryptionService = new Mock<IEncryptionService>();

            var repository = new ChatRoomRepository(
                context,
                NullLogger<ChatRoomRepository>.Instance,
                mockEncryptionService.Object
            );

            var groupName = "Test Group";
            var creatorId = "creator1";
            var initialFriends = new List<GroupChatMember>
    {
        new GroupChatMember { UserId = "friend1" },
        new GroupChatMember { UserId = "friend2" }
    };

            // Act
            var groupId = await repository.CreateGroupChatAsync(groupName, creatorId, initialFriends);

            // Assert
            var groupChat = await context.GroupChats
                .Include(gc => gc.Members)
                .FirstOrDefaultAsync(gc => gc.Id == groupId);

            Assert.NotNull(groupChat);
            Assert.Equal(groupName, groupChat.GroupName);
            Assert.Equal(3, groupChat.Members.Count); // Creator + 2 friends
        }
        [Fact]
        public async Task GetUserGroupChatsAsync_Should_ReturnGroupChatsForUser()
        {
            // Arrange
            var options = new DbContextOptionsBuilder<StudyProductivityDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            await using var context = new StudyProductivityDbContext(options);
            var mockEncryptionService = new Mock<IEncryptionService>();

            var repository = new ChatRoomRepository(
                context,
                NullLogger<ChatRoomRepository>.Instance,
                mockEncryptionService.Object
            );

            var groupChat = new GroupChat
            {
                GroupName = "Group Chat 1",
                CreatorId = "user1",
                Members = new List<GroupChatMember>
        {
            new GroupChatMember { UserId = "user1" },
            new GroupChatMember { UserId = "user2" }
        }
            };

            context.GroupChats.Add(groupChat);
            await context.SaveChangesAsync();

            // Act
            var userGroupChats = await repository.GetUserGroupChatsAsync("user1");

            // Assert
            Assert.Single(userGroupChats);
            Assert.Equal("Group Chat 1", userGroupChats.First().GroupName);
        }
        [Fact]
        public async Task AddFriendToGroupAsync_Should_AddFriend_ToExistingGroup()
        {
            // Arrange
            var options = new DbContextOptionsBuilder<StudyProductivityDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            await using var context = new StudyProductivityDbContext(options);

            // Create mock encryption service
            var mockEncryptionService = new Mock<IEncryptionService>();

            var repository = new ChatRoomRepository(
                context,
                NullLogger<ChatRoomRepository>.Instance,
                mockEncryptionService.Object
            );

            var groupChat = new GroupChat
            {
                Id = "group1",
                GroupName = "Test Group"
            };

            context.GroupChats.Add(groupChat);
            await context.SaveChangesAsync();

            // Act
            await repository.AddFriendToGroupAsync("group1", "friend1");

            // Assert
            var member = await context.GroupChatMembers.FirstOrDefaultAsync(m => m.GroupChatId == "group1" && m.UserId == "friend1");
            Assert.NotNull(member);
        }

        [Fact]
        public async Task DeleteGroupChatAsync_DeletesGroupChatAndMembers()
        {
            // Arrange
            var groupId = "group1";

            // Act
            await _repository.DeleteGroupChatAsync(groupId);

            // Assert
            var groupChat = await _context.GroupChats.FindAsync(groupId);
            var members = await _context.GroupChatMembers.Where(m => m.GroupChatId == groupId).ToListAsync();

            Assert.Null(groupChat);  // Group chat should be deleted
            Assert.Empty(members);   // Members should be removed
        }

        [Fact]
        public async Task SaveGroupMessageAsync_SavesMessageWithGroupChatId()
        {
            // Arrange
            var message = new Message
            {
                Content = "Hello Group!",
                SentAt = DateTime.UtcNow,
                UserId = "User1"
            };

            // Act
            var savedMessage = await _repository.SaveGroupMessageAsync("group1", message);

            // Assert
            var saved = await _context.Messages.FindAsync(savedMessage.MessageId);
            Assert.NotNull(saved);
            Assert.Equal("group1", saved.GroupChatId);
            Assert.Equal("User1", saved.UserId);
            Assert.Equal("Hello Group!", saved.Content);
        }

        [Fact]
        public async Task SavePrivateMessageAsync_SavesMessageWithChatRoomId()
        {
            // Arrange
            var message = new Message
            {
                Content = "Hello Bob!",
                SentAt = DateTime.UtcNow,
                UserId = "User1"
            };

            // Act
            var savedMessage = await _repository.SavePrivateMessageAsync(1, message);

            // Assert
            var saved = await _context.Messages.FindAsync(savedMessage.MessageId);
            Assert.NotNull(saved);
            Assert.Equal(1, saved.ChatRoomId);
            Assert.Equal("User1", saved.UserId);
            Assert.Equal("Hello Bob!", saved.Content);
        }

        public async Task SeedDatabaseAsync(StudyProductivityDbContext context)
        {
            // Seed data if necessary for the test
            var groupId = "group1";  // Ensure this matches the ID you're testing with

            var groupChat = new GroupChat
            {
                Id = groupId,
                GroupName = "Group 1",
                CreatedAt = DateTime.UtcNow,
                CreatorId = "user1",
                Members = new List<GroupChatMember>
        {
            new GroupChatMember { UserId = "user1", GroupChatId = groupId },
            new GroupChatMember { UserId = "user2", GroupChatId = groupId }
        },
                Messages = new List<Message>
        {
            new Message { Content = "Test message", SentAt = DateTime.UtcNow, UserId = "user1" }
        }
            };

            context.GroupChats.Add(groupChat);
            await context.SaveChangesAsync();
        }

        [Fact]
        public async Task GetGroupChatByIdAsync_ReturnsGroupChat()
        {
            // Arrange
            var options = new DbContextOptionsBuilder<StudyProductivityDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            await using var context = new StudyProductivityDbContext(options);
            var mockEncryptionService = new Mock<IEncryptionService>();

            var repository = new ChatRoomRepository(
                context,
                NullLogger<ChatRoomRepository>.Instance,
                mockEncryptionService.Object
            );

            // Seed the database with the necessary data
            await SeedDatabaseAsync(context);

            var groupId = "group1"; // This must match the ID seeded in the database

            // Act
            var groupChat = await repository.GetGroupChatByIdAsync(groupId);

            // Assert
            Assert.NotNull(groupChat);
            Assert.Equal(groupId, groupChat.Id);
            Assert.Equal("Group 1", groupChat.GroupName);
        }

        [Fact]
        public async Task QueueMessageForOfflineUserAsync_QueuesMessage()
        {
            // Arrange
            var message = new Message
            {
                Content = "Offline Message",
                SentAt = DateTime.UtcNow,
                UserId = "User1"
            };

            // Act
            await _repository.QueueMessageForOfflineUserAsync(message, "User2");

            // Assert
            var queuedMessage = await _context.Messages
                .FirstOrDefaultAsync(m => m.Content == "Offline Message");
            Assert.NotNull(queuedMessage);
            Assert.True(queuedMessage.IsQueued);
            Assert.False(queuedMessage.IsDelivered);
        }

        [Fact]
public async Task FetchMessagesAsync_FetchesMessagesForGroupChat()
{
    // Arrange
    var mockLogger = new Mock<ILogger<MessageRepository>>();
    var encryptedContent1 = "EncryptedGroupMessage1";
    var encryptedContent2 = "EncryptedGroupMessage2";
    var decryptedContent1 = "Group Message 1";
    var decryptedContent2 = "Group Message 2";

    // Setup encryption/decryption mock
    _encryptionServiceMock.Setup(e => e.Decrypt(encryptedContent1))
        .Returns(decryptedContent1);
    _encryptionServiceMock.Setup(e => e.Decrypt(encryptedContent2))
        .Returns(decryptedContent2);

    var message1 = new Message
    {
        Content = encryptedContent1,
        SentAt = DateTime.UtcNow.AddMinutes(-1),
        GroupChatId = "group1",
        UserId = "User1"
    };
    
    var message2 = new Message
    {
        Content = encryptedContent2,
        SentAt = DateTime.UtcNow,
        GroupChatId = "group1",
        UserId = "User2"
    };

    await _context.Messages.AddRangeAsync(message1, message2);
    await _context.SaveChangesAsync();

    

    // Act
    var messages = await _repository.FetchMessagesAsync("group1", true, 0, 10);

    // Assert
    Assert.Equal(2, messages.Count());
    Assert.Equal(decryptedContent2, messages.First().Content); // Most recent message
    Assert.Equal(decryptedContent1, messages.Last().Content); // Older message
    
    // Verify encryption service was called
    _encryptionServiceMock.Verify(e => e.Decrypt(encryptedContent1), Times.Once);
    _encryptionServiceMock.Verify(e => e.Decrypt(encryptedContent2), Times.Once);
}
        [Fact]
public async Task FetchMessagesAsync_FetchesMessagesForPrivateChat()
{
    // Arrange
    var mockLogger = new Mock<ILogger<MessageRepository>>();
    var encryptedContent1 = "EncryptedMessage1";
    var encryptedContent2 = "EncryptedMessage2";
    var decryptedContent1 = "Private Message 1";
    var decryptedContent2 = "Private Message 2";

    // Setup encryption/decryption mock
    _encryptionServiceMock.Setup(e => e.Decrypt(encryptedContent1))
        .Returns(decryptedContent1);
    _encryptionServiceMock.Setup(e => e.Decrypt(encryptedContent2))
        .Returns(decryptedContent2);

    var message1 = new Message
    {
        Content = encryptedContent1,
        SentAt = DateTime.UtcNow.AddMinutes(-1),
        ChatRoomId = 1,
        UserId = "User1"
    };
    
    var message2 = new Message
    {
        Content = encryptedContent2,
        SentAt = DateTime.UtcNow,
        ChatRoomId = 1,
        UserId = "User2"
    };

    await _context.Messages.AddRangeAsync(message1, message2);
    await _context.SaveChangesAsync();

   
    // Act
    var messages = await _repository.FetchMessagesAsync(1, false, 0, 10);

    // Assert
    Assert.Equal(2, messages.Count());
    Assert.Equal(decryptedContent2, messages.First().Content); // Most recent message
    Assert.Equal(decryptedContent1, messages.Last().Content); // Older message
    
    // Verify encryption service was called
    _encryptionServiceMock.Verify(e => e.Decrypt(encryptedContent1), Times.Once);
    _encryptionServiceMock.Verify(e => e.Decrypt(encryptedContent2), Times.Once);
}


        [Fact]
        public async Task GetGroupMembersAsync_ReturnsGroupMembers()
        {
            // Arrange
            var groupId = "test-group-id";

            // Add test data directly to the in-memory database
            _context.GroupChatMembers.AddRange(
                new GroupChatMember { UserId = "user1", GroupChatId = groupId, User = new User { UserId = "user1", Username = "user1" } },
                new GroupChatMember { UserId = "user2", GroupChatId = groupId, User = new User { UserId = "user2", Username = "user2" } }
            );
            await _context.SaveChangesAsync(); // Save changes to in-memory database

            // Act
            var result = await _repository.GetGroupMembersAsync(groupId);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(2, result.Count());
            Assert.Contains(result, gm => gm.UserId == "user1");
            Assert.Contains(result, gm => gm.UserId == "user2");
        }



        [Fact]
        public async Task DeleteAllMessagesAsync_RemovesMessagesForGroupChat()
        {
            // Arrange
            var groupId = "test-group-id";
            var messages = new List<Message>
        {
            new Message { MessageId = 1, GroupChatId = groupId, Content = "Hello" },
            new Message { MessageId = 2, GroupChatId = groupId, Content = "World" }
        };

            // Add data to the in-memory database
            _context.Messages.AddRange(messages);
            await _context.SaveChangesAsync();

            // Act
            await _repository.DeleteAllMessagesAsync(groupId, true);

            // Assert
            var remainingMessages = await _context.Messages.ToListAsync();
            Assert.Empty(remainingMessages);
        }

        [Fact]
        public async Task DeleteAllMessagesAsync_RemovesMessagesForPrivateChat()
        {
            // Arrange
            var chatRoomId = 123;
            var messages = new List<Message>
        {
            new Message { MessageId = 1, ChatRoomId = chatRoomId, Content = "Private Message" }
        };

            // Add data to the in-memory database
            _context.Messages.AddRange(messages);
            await _context.SaveChangesAsync();

            // Act
            await _repository.DeleteAllMessagesAsync(chatRoomId, false);

            // Assert
            var remainingMessages = await _context.Messages.ToListAsync();
            Assert.Empty(remainingMessages);
        }

        [Fact]
        public async Task KickMembersFromGroupChatAsync_KicksMemberIfRequesterIsCreator()
        {
            // Arrange
            var groupId = "test-group-id";
            var memberId = "user2";
            var requesterId = "user1";
            var groupChat = new GroupChat
            {
                Id = groupId,
                CreatorId = requesterId,
                Members = new List<GroupChatMember>
                {
                    new GroupChatMember { UserId = "user1", GroupChatId = groupId },
                    new GroupChatMember { UserId = "user2", GroupChatId = groupId }
                }
            };

            // Add data to the in-memory database
            _context.GroupChats.Add(groupChat);
            await _context.SaveChangesAsync();

            // Act
            await _repository.KickMembersFromGroupChatAsync(groupId, memberId, requesterId);

            // Assert
            var remainingMembers = await _context.GroupChatMembers.ToListAsync();
            Assert.DoesNotContain(remainingMembers, gm => gm.UserId == memberId);
        }

        [Fact]
        public async Task KickMembersFromGroupChatAsync_ThrowsUnauthorizedAccessIfRequesterIsNotCreator()
        {
            // Arrange
            var groupId = "test-group-id";
            var memberId = "user2";
            var requesterId = "user3"; // Not the creator
            var groupChat = new GroupChat
            {
                Id = groupId,
                CreatorId = "user1",
                Members = new List<GroupChatMember>
                {
                    new GroupChatMember { UserId = "user1", GroupChatId = groupId },
                    new GroupChatMember { UserId = "user2", GroupChatId = groupId }
                }
            };

            // Add data to the in-memory database
            _context.GroupChats.Add(groupChat);
            await _context.SaveChangesAsync();

            // Act & Assert
            await Assert.ThrowsAsync<UnauthorizedAccessException>(() =>
                _repository.KickMembersFromGroupChatAsync(groupId, memberId, requesterId));
        }

        public async Task KickMembersFromGroupChatAsync(string groupId, string memberId, string requesterId)
        {
            var groupChat = await _context.GroupChats
                .Include(gc => gc.Members)
                .FirstOrDefaultAsync(gc => gc.Id == groupId);

            if (groupChat == null)
            {
                throw new InvalidOperationException("Group chat not found.");
            }

            // Check if the requester is the group creator or a member of the group
            if (groupChat.CreatorId != requesterId)
            {
                throw new UnauthorizedAccessException("Only the group creator can kick members.");
            }

            var memberToKick = groupChat.Members.FirstOrDefault(m => m.UserId == memberId);

            if (memberToKick == null)
            {
                throw new InvalidOperationException("Member not found in the group chat.");
            }

            groupChat.Members.Remove(memberToKick);
            await _context.SaveChangesAsync();
        }



        public void Dispose()
        {
            // Clean up the in-memory database after tests
            _context.Database.EnsureDeleted();
            _context.Dispose();
        }
    }
}