using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using StudyProductivityApp.Core.Interfaces.RepositoryInterfaces;
using StudyProductivityApp.Core.Interfaces.ServiceInterfaces;
using StudyProductivityApp.Core.Models;
using StudyProductivityApp.Core.Models.Dtos;
using StudyProductivityApp.Persistence.Data;

namespace StudyProductivityApp.Persistence.Repositories
{
    public class ChatRoomRepository : IChatRoomRepository
    {
        private readonly StudyProductivityDbContext _context;
        private readonly ILogger<ChatRoomRepository> _logger;
        private readonly IEncryptionService _encryptionService;

        public ChatRoomRepository(StudyProductivityDbContext context, ILogger<ChatRoomRepository> logger, IEncryptionService encryptionService)
        {
            _encryptionService = encryptionService;
            _logger = logger;
            _context = context;
        }

        public async Task<ChatRoom> CreateChatRoomAsync(ChatRoom chatRoom, IEnumerable<string> userIds)
        {
            if (chatRoom == null)
            {
                throw new ArgumentNullException(nameof(chatRoom), "ChatRoom cannot be null.");
            }
            if (userIds == null || !userIds.Any())
            {
                throw new ArgumentException("User IDs cannot be null or empty.", nameof(userIds));
            }

            // Ensure ChatParticipants is initialized (if it's null)
            chatRoom.ChatParticipants ??= new List<ChatParticipant>();

            // Create ChatParticipants for each user
            foreach (var userId in userIds)
            {
                var chatParticipant = new ChatParticipant
                {
                    UserId = userId,
                    ChatParticipantId = Guid.NewGuid().ToString()
                };
                chatRoom.ChatParticipants.Add(chatParticipant); // Assuming Participants is a navigation property in ChatRoom
            }

            _context.ChatRooms.Add(chatRoom);
            await _context.SaveChangesAsync();

            return chatRoom;
        }



        private async Task<bool> IsGroupChatByChatRoomIdAsync(int chatRoomId)
        {
            var chatRoom = await _context.ChatRooms.FindAsync(chatRoomId);
            return chatRoom?.IsGroupChat ?? false;
        }

        private async Task<bool> IsGroupChatByGroupIdAsync(string Id)
        {
            var groupChat = await _context.GroupChats.FindAsync(Id);
            return groupChat != null; // Assuming all group chats are inherently group chats
        }

        public async Task<bool> GetIsGroupChatAsync(object chatId)
        {
            if (chatId is int chatRoomId)
            {
                return await IsGroupChatByChatRoomIdAsync(chatRoomId);
            }
            else if (chatId is string groupId)
            {
                return await IsGroupChatByGroupIdAsync(groupId);
            }
            throw new ArgumentException("Invalid chat ID type");
        }


        public async Task<IEnumerable<ChatRoom>> GetUserChatRoomsAsync(string userId1, string userId2)
        {
            if (string.IsNullOrEmpty(userId1) || string.IsNullOrEmpty(userId2))
            {
                throw new ArgumentException("User IDs cannot be null or empty.", nameof(userId1));
            }

            return await _context.ChatRooms
                .Include(c => c.ChatParticipants)
                .Where(c => c.ChatParticipants.Any(p => p.UserId == userId1) &&
                             c.ChatParticipants.Any(p => p.UserId == userId2))
                .ToListAsync();
        }


        public async Task<string> CreateGroupChatAsync(string groupName, string creatorId, List<GroupChatMember> initialFriends)
        {
            if (string.IsNullOrEmpty(groupName) || string.IsNullOrEmpty(creatorId) || initialFriends == null || !initialFriends.Any())
            {
                throw new ArgumentException("Group name, creator ID, or initial friends list is invalid.");
            }

            // Create a new GroupChat entity
            var groupChat = new GroupChat
            {
                GroupName = groupName,
                CreatorId = creatorId,
                CreatedAt = DateTime.UtcNow
            };

            _context.GroupChats.Add(groupChat);
            await _context.SaveChangesAsync();

            // Add the creator and initial friends to the GroupChatMembers table
            var members = new List<GroupChatMember>
            {
                new GroupChatMember { GroupChatId = groupChat.Id, UserId = creatorId }
            };

            // Add each friend as a GroupChatMember
            foreach (var friend in initialFriends)
            {
                members.Add(new GroupChatMember { GroupChatId = groupChat.Id, UserId = friend.UserId });
            }

            _context.GroupChatMembers.AddRange(members);
            await _context.SaveChangesAsync();

            return groupChat.Id; // Return the group chat ID
        }

        public async Task<IEnumerable<GroupChat>> GetUserGroupChatsAsync(string userId)
        {
            if (string.IsNullOrEmpty(userId))
            {
                throw new ArgumentException("User ID cannot be null or empty.", nameof(userId));
            }

            return await _context.GroupChats
                .Include(gc => gc.Members)  // Includes GroupChatMember entities
                    .ThenInclude(m => m.User) // Ensures User data for each GroupChatMember is loaded
                .Where(gc => gc.CreatorId == userId || gc.Members.Any(m => m.UserId == userId))
                .ToListAsync();
        }


        // Add a friend to a group
        public async Task AddFriendToGroupAsync(string groupId, string friendId)
        {
            if (string.IsNullOrEmpty(groupId) || string.IsNullOrEmpty(friendId))
            {
                throw new ArgumentException("Group ID and friend ID cannot be null or empty.");
            }

            var groupChatMember = new GroupChatMember
            {
                GroupChatId = groupId,
                UserId = friendId
            };

            _context.GroupChatMembers.Add(groupChatMember);
            await _context.SaveChangesAsync();
        }



        // Delete the entire group chat
        public async Task DeleteGroupChatAsync(string groupId)
        {
            if (string.IsNullOrEmpty(groupId))
            {
                throw new ArgumentException("Group ID cannot be null or empty.");
            }

            var groupChat = await _context.GroupChats
                .FirstOrDefaultAsync(g => g.Id == groupId);

            if (groupChat != null)
            {
                // Remove associated members first
                var members = _context.GroupChatMembers.Where(m => m.GroupChatId == groupId);
                _context.GroupChatMembers.RemoveRange(members);

                // Remove the group chat
                _context.GroupChats.Remove(groupChat);
                await _context.SaveChangesAsync();
            }
        }

        private async Task<Message> SaveMessageAsync(string chatId, Message message, bool isGroupChat)
        {
            if (message == null)
            {
                throw new ArgumentNullException(nameof(message), "Message cannot be null.");
            }

            if (isGroupChat)
            {
                message.GroupChatId = chatId; // Set GroupChatId for group messages
            }
            else
            {
                message.ChatRoomId = Convert.ToInt32(chatId); // Set ChatRoomId for private messages
            }

            // Safely log the message content and user details, checking for null values
            var userUsername = message.UserId ?? "Unknown User"; // Default to "Unknown User" if UserId is null
            var messageContent = message.Content ?? "No content"; // Default to "No content" if message content is null

            _logger.LogInformation($"Message to be saved: Content = {messageContent}, User = {userUsername}");
            _logger.LogInformation($"SAVING MESSAGE INVOKED");

            await _context.Messages.AddAsync(message);
            await _context.SaveChangesAsync();
            return message;
        }



        // For Group Chats
        public async Task<Message> SaveGroupMessageAsync(string Id, Message message)
        {
            return await SaveMessageAsync(Id, message, true);
        }

        public async Task<Message> SavePrivateMessageAsync(int chatRoomId, Message message)
        {
            return await SaveMessageAsync(chatRoomId.ToString(), message, false);
        }


        public async Task<GroupChat> GetGroupChatByIdAsync(string groupId)
        {
            if (string.IsNullOrEmpty(groupId))
            {
                throw new ArgumentException("Group ID cannot be null or empty.", nameof(groupId));
            }

            var groupChat = await _context.GroupChats
                .Include(gc => gc.Members)
                .Include(gc => gc.Messages)
                .FirstOrDefaultAsync(gc => gc.Id == groupId);

            if (groupChat == null)
                throw new Exception("Group chat not found.");

            return groupChat;
        }

        public async Task QueueMessageForOfflineUserAsync(Message message, string recipientUserId)
        {
            if (message == null || string.IsNullOrEmpty(recipientUserId))
                throw new ArgumentException("Message or recipient user ID cannot be null.");

            message.IsQueued = true;
            message.IsDelivered = false;
            message.UserId = recipientUserId;

            if (!_context.Messages.Any(m => m.MessageId == message.MessageId))
            {
                _context.Messages.Add(message);
            }
            else
            {
                _context.Messages.Update(message);
            }

            await _context.SaveChangesAsync();
        }

        public async Task<List<Message>> FetchMessagesAsync(object chatId, bool isGroupChat, int offset, int limit)
{
    if (chatId == null)
    {
        throw new ArgumentNullException(nameof(chatId), "Chat ID cannot be null.");
    }

    List<Message> messages;

    try
    {
        if (isGroupChat)
        {
            if (chatId is not string groupChatId)
            {
                throw new ArgumentException("Chat ID must be a string for group chats.", nameof(chatId));
            }

            // Fetch encrypted messages
            messages = await _context.Messages
                .Include(m => m.User)
                .Where(m => m.GroupChatId == groupChatId)
                .OrderByDescending(m => m.SentAt)
                .Skip(offset)
                .Take(limit)
                .ToListAsync();
        }
        else
        {
            if (chatId is not int chatRoomId)
            {
                throw new ArgumentException("Chat ID must be an integer for private chats.", nameof(chatId));
            }

            // Fetch encrypted messages
            messages = await _context.Messages
                .Include(m => m.User)
                .Where(m => m.ChatRoomId == chatRoomId)
                .OrderByDescending(m => m.SentAt)
                .Skip(offset)
                .Take(limit)
                .ToListAsync();
        }

        // Decrypt messages
        foreach (var message in messages)
        {
            try
            {
                message.Content = _encryptionService.Decrypt(message.Content);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to decrypt message {MessageId}", message.MessageId);
                message.Content = "Error decrypting message"; // Fallback content
            }
        }

        return messages;
    }
    catch (Exception ex)
    {
        _logger.LogError(ex, "Error fetching and decrypting messages for chat {ChatId}", chatId);
        throw;
    }
}


        public async Task<IEnumerable<GroupChatMember>> GetGroupMembersAsync(string groupId)
        {
            // Query GroupChatMembers directly, filtering by GroupChatId
            var groupMembers = await _context.GroupChatMembers
                .Include(gm => gm.User) // Optionally include the User navigation property
                .Where(gm => gm.GroupChatId == groupId)
                .ToListAsync();

            return groupMembers;
        }


        // Method to delete all messages associated with a specific chatRoomId or groupChatId
        public async Task DeleteAllMessagesAsync(object chatId, bool isGroupChat)
        {
            if (chatId == null)
            {
                throw new ArgumentNullException(nameof(chatId), "Chat ID cannot be null.");
            }

            IQueryable<Message> messagesQuery;

            if (isGroupChat && chatId is string groupChatId)
            {
                messagesQuery = _context.Messages.Where(m => m.GroupChatId == groupChatId);
            }
            else if (!isGroupChat && chatId is int chatRoomId)
            {
                messagesQuery = _context.Messages.Where(m => m.ChatRoomId == chatRoomId);
            }
            else
            {
                throw new ArgumentException("Invalid chat ID type for the specified chat type.");
            }

            _context.Messages.RemoveRange(messagesQuery);
            await _context.SaveChangesAsync();
        }

        public async Task KickMembersFromGroupChatAsync(string groupId, string memberId, string requesterId)
        {
            // Validate inputs
            if (string.IsNullOrEmpty(groupId))
                throw new ArgumentException("Group ID cannot be null or empty.", nameof(groupId));
            if (memberId == null)
                throw new ArgumentException("At least one member ID must be provided.", nameof(memberId));
            if (string.IsNullOrEmpty(requesterId))
                throw new ArgumentException("Requester ID cannot be null or empty.", nameof(requesterId));

            // Retrieve the group chat from the database
            var groupChat = await _context.GroupChats
                .Include(gc => gc.Members)
                .FirstOrDefaultAsync(gc => gc.Id == groupId) ?? throw new InvalidOperationException($"Group chat with ID {groupId} does not exist.");

            // Check if the requester is the creator of the group chat
            if (groupChat.CreatorId != requesterId)
                throw new UnauthorizedAccessException("Only the creator of the group chat can kick members.");

            // Filter members to kick that are actually part of the group
            var memberToKick = groupChat.Members
                .Where(m => memberId == m.UserId) ?? throw new InvalidOperationException("No valid member found to kick.");

            // Remove members from the group chat
            _context.GroupChatMembers.RemoveRange(memberToKick);

            // Save changes to the database
            await _context.SaveChangesAsync();
        }



    }
}
