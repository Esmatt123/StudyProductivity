using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using StudyProductivityApp.Core.Models;
using StudyProductivityApp.Core.Models.Dtos;

namespace StudyProductivityApp.Core.Interfaces.ServiceInterfaces
{
    public interface IChatService
    {
        Task<ChatRoom> CreateChatRoomAsync(string roomName, bool isGroupChat, IEnumerable<string> participantUserIds);
        Task<Message> SendMessageAsync(int chatRoomId, string userId, string content);
        Task<IEnumerable<ChatRoom>> GetUserChatRoomsAsync(string userId1, string userId2);
        Task<string> CreateGroupChatAsync(string groupName, string creatorId, List<GroupChatMember> initialFriends);
        Task AddFriendToGroupAsync(string groupId, string friendId);
        Task DeleteGroupChatAsync(string groupId);
        Task<Message> SaveGroupMessageAsync(string Id, Message message);
        Task<Message> SavePrivateMessageAsync(int chatRoomId, Message message);
        Task<ChatRoom> GetOrCreatePrivateChatRoomAsync(string senderUserId, string recipientUserId);
        Task<bool> GetIsGroupChatAsync(object chatId);
        Task<GroupChat> GetGroupChatByIdAsync(string groupId);
        Task<IEnumerable<GroupChat>> GetUserGroupChatsAsync(string userId);
        Task QueueMessageForOfflineUserAsync(Message message, string recipientUserId);
        Task<List<Message>> FetchMessagesAsync(object chatId, bool isGroupChat, int offset, int limit);
        Task<IEnumerable<GroupChatMember>> GetGroupMembersAsync(string groupId);
        Task DeleteAllMessagesAsync(object chatId, bool isGroupChat);
        Task KickMembersFromGroupChatAsync(string groupId, string memberId, string requesterId);
        Task<IEnumerable<Message>> GetGroupMessagesAsync(string groupId);

        
    }
}