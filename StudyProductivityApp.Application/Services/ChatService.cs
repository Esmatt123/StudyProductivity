using StudyProductivityApp.Core.Interfaces.RepositoryInterfaces;
using StudyProductivityApp.Core.Interfaces.ServiceInterfaces;
using StudyProductivityApp.Core.Models;
using StudyProductivityApp.Core.Models.Dtos;

namespace StudyProductivityApp.Application.Services
{
    public class ChatService : IChatService
    {
        private readonly IChatRoomRepository _chatRoomRepository;
        private readonly IMessageRepository _messageRepository;

        public ChatService(IChatRoomRepository chatRoomRepository, IMessageRepository messageRepository)
        {
            _chatRoomRepository = chatRoomRepository;
            _messageRepository = messageRepository;
        }

        public async Task<ChatRoom> CreateChatRoomAsync(string roomName, bool isGroupChat, IEnumerable<string> participantUserIds)
        {
            var chatRoom = new ChatRoom
            {
                RoomName = roomName,
                IsGroupChat = isGroupChat,
                ChatParticipants = participantUserIds.Select(id => new ChatParticipant { UserId = id }).ToList()
            };

            return await _chatRoomRepository.CreateChatRoomAsync(chatRoom, participantUserIds);
        }

        public async Task<Message> SendMessageAsync(int chatRoomId, string userId, string content)
        {
            var message = new Message
            {
                ChatRoomId = chatRoomId,
                UserId = userId,
                Content = content,
                SentAt = DateTime.UtcNow
            };

            return await _messageRepository.CreateMessageAsync(message);
        }

        public async Task<IEnumerable<ChatRoom>> GetUserChatRoomsAsync(string userId1, string userId2)
        {
            return await _chatRoomRepository.GetUserChatRoomsAsync(userId1, userId2);
        }

        public async Task<string> CreateGroupChatAsync(string groupName, string creatorId, List<GroupChatMember> initialFriends)
        {
            // Call repository to create the group chat
            return await _chatRoomRepository.CreateGroupChatAsync(groupName, creatorId, initialFriends);
        }

        public async Task AddFriendToGroupAsync(string groupId, string friendId)
        {
            // Call repository to add a friend to the group chat
            await _chatRoomRepository.AddFriendToGroupAsync(groupId, friendId);
        }



        public async Task DeleteGroupChatAsync(string groupId)
        {
            // Call repository to delete the group chat
            await _chatRoomRepository.DeleteGroupChatAsync(groupId);
        }



        public async Task<Message> SaveGroupMessageAsync(string groupId, Message message)
        {
            return await _chatRoomRepository.SaveGroupMessageAsync(groupId, message);
        }

        public async Task<ChatRoom> GetOrCreatePrivateChatRoomAsync(string senderUserId, string recipientUserId)
        {
            var chatRooms = await _chatRoomRepository.GetUserChatRoomsAsync(senderUserId, recipientUserId);

            // Check if a private chat room already exists between these two users
            var privateChatRoom = chatRooms.FirstOrDefault(c => c.IsGroupChat == false &&
                                                               c.ChatParticipants.Any(p => p.UserId == recipientUserId));

            if (privateChatRoom == null)
            {
                // Create a new private chat room if it doesn't exist
                var newChatRoomDto = new ChatRoomDto
                {
                    IsGroupChat = false,
                    ChatParticipants = new List<ChatParticipantDto>
            {
                new() { UserId = senderUserId, ChatParticipantId = Guid.NewGuid().ToString() },
                new() { UserId = recipientUserId, ChatParticipantId = Guid.NewGuid().ToString() }
            }
                };

                // Convert DTO to model manually
                var newChatRoom = new ChatRoom
                {
                    IsGroupChat = newChatRoomDto.IsGroupChat,
                    ChatParticipants = newChatRoomDto.ChatParticipants.Select(p => new ChatParticipant
                    {
                        UserId = p.UserId,
                        ChatParticipantId = p.ChatParticipantId,
                    }).ToList()
                };

                // Call CreateChatRoomAsync with the necessary user IDs
                var userIds = new List<string> { senderUserId, recipientUserId }; // Create a list of user IDs
                privateChatRoom = await _chatRoomRepository.CreateChatRoomAsync(newChatRoom, userIds);
            }

            return privateChatRoom;
        }





        public async Task<GroupChat> GetGroupChatByIdAsync(string groupId)
        {
            return await _chatRoomRepository.GetGroupChatByIdAsync(groupId);
        }

        public async Task<IEnumerable<GroupChat>> GetUserGroupChatsAsync(string userId)
        {
            return await _chatRoomRepository.GetUserGroupChatsAsync(userId);
        }

        public async Task QueueMessageForOfflineUserAsync(Message message, string recipientUserId)
        {
            await _chatRoomRepository.QueueMessageForOfflineUserAsync(message, recipientUserId);
        }



        public async Task<Message> SavePrivateMessageAsync(int chatRoomId, Message message)
        {
            return await _chatRoomRepository.SavePrivateMessageAsync(chatRoomId, message);
        }

        public async Task<bool> GetIsGroupChatAsync(object chatId)
        {
            return await _chatRoomRepository.GetIsGroupChatAsync(chatId);
        }

        public async Task<List<Message>> FetchMessagesAsync(object chatId, bool isGroupChat, int offset, int limit)
        {
            return await _chatRoomRepository.FetchMessagesAsync(chatId, isGroupChat, offset, limit);
        }

        public async Task<IEnumerable<GroupChatMember>> GetGroupMembersAsync(string groupId)
        {
            return await _chatRoomRepository.GetGroupMembersAsync(groupId);
        }



        public async Task DeleteAllMessagesAsync(object chatId, bool isGroupChat)
        {
            await _chatRoomRepository.DeleteAllMessagesAsync(chatId, isGroupChat);
        }

        public async Task KickMembersFromGroupChatAsync(string groupId, string memberId, string requesterId)
        {
            await _chatRoomRepository.KickMembersFromGroupChatAsync(groupId, memberId, requesterId);
        }

        public async Task<IEnumerable<Message>> GetGroupMessagesAsync(string groupId)
        {
            try
            {
                if (string.IsNullOrEmpty(groupId))
                {
                    throw new ArgumentException("GroupId cannot be null or empty", nameof(groupId));
                }

                return await _messageRepository.GetMessagesByGroupIdAsync(groupId);
            }
            catch (Exception ex)
            {
                // Log the error
                throw new InvalidOperationException($"Failed to retrieve messages for group {groupId}", ex);
            }
        }
    }
}