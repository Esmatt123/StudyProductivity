using Microsoft.ApplicationInsights;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using StudyProductivityApp.Core.Interfaces.ServiceInterfaces;
using StudyProductivityApp.Core.Models;
using StudyProductivityApp.Core.Models.Dtos;
using System.Collections.Concurrent;
namespace StudyProductivityApp.Api.Hubs
{
    public class ChatHub : Hub
    {
        private static readonly ConcurrentDictionary<string, string> _connectedUsers = new();
        private readonly IChatService _chatService;
        private readonly IUserService _userService;
        private readonly ILogger<ChatHub> _logger;
        private static readonly Dictionary<string, HashSet<string>> _groupMembers = new();

        private readonly IEncryptionService _encryptionService;
        private readonly TelemetryClient _telemetryClient;

        public ChatHub(IChatService chatService, IUserService userService, ILogger<ChatHub> logger, IEncryptionService encryptionService, TelemetryClient telemetryClient)
        {
            _telemetryClient = telemetryClient;
            _encryptionService = encryptionService;
            _chatService = chatService;
            _userService = userService;
            _logger = logger;
        }

        public async Task SendPrivateMessage(string recipientUserId, string messageContent, int chatRoomId)
        {
            var startTime = DateTime.UtcNow;
            var success = true;
            try
            {


                if (IsInvalidMessage(recipientUserId, messageContent, out var errorMessage))
                {
                    await Clients.Caller.SendAsync("Error", errorMessage);
                    return;
                }

                var senderUserId = Context.UserIdentifier;

                if (chatRoomId <= 0)
                {
                    await Clients.Caller.SendAsync("Error", "ChatRoomId must be a positive integer.");
                    return;
                }

                // Add null check for encryption service
                if (_encryptionService == null)
                {
                    _logger.LogError("Encryption service is not properly initialized");
                    await Clients.Caller.SendAsync("Error", "Internal server error");
                    return;
                }

                string encryptedContent;
                try
                {
                    encryptedContent = _encryptionService.Encrypt(messageContent);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error encrypting message");
                    await Clients.Caller.SendAsync("Error", "Failed to process message");
                    return;
                }

                var messageDto = new MessageDto
                {
                    Content = encryptedContent,
                    UserId = senderUserId,
                    ChatRoomId = chatRoomId,
                    SentAt = DateTime.UtcNow
                };

                _telemetryClient.TrackEvent("PrivateMessageSent", new Dictionary<string, string>
            {
                { "SenderId", Context.UserIdentifier ?? "unknown" },
                { "RecipientId", recipientUserId },
                { "ChatRoomId", chatRoomId.ToString() }
            });

                await HandleMessageSending(recipientUserId, messageDto);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in SendPrivateMessage");
                success = false;
                _telemetryClient.TrackException(ex, new Dictionary<string, string>
            {
                { "SenderId", Context.UserIdentifier ?? "unknown" },
                { "RecipientId", recipientUserId },
                { "ChatRoomId", chatRoomId.ToString() }
            });
                await Clients.Caller.SendAsync("Error", "An unexpected error occurred");
            }
            finally
            {
                _telemetryClient.TrackRequest(
                    "SendPrivateMessage",
                    startTime,
                    DateTime.UtcNow - startTime,
                    success ? "200" : "500",
                    success);
            }
        }


        [Authorize]
        public async Task SendMessageToGroup(string groupId, string message)
        {
            var startTime = DateTime.UtcNow;
            var success = true;
            try
            {
                var senderUserId = Context.UserIdentifier;

                if (string.IsNullOrEmpty(senderUserId))
                {
                    _logger.LogWarning("Sender user ID is null or empty. Aborting message sending.");
                    await Clients.Caller.SendAsync("Error", "Invalid sender");
                    return;
                }

                if (!IsValidGroupMessage(groupId, message))
                {
                    await Clients.Caller.SendAsync("Error", "Invalid message or group ID");
                    return;
                }

                await EnsureGroupMembersAdded(groupId);

                var senderUsername = (await _userService.GetUserByIdAsync(senderUserId))?.Username ?? "Unknown";

                try
                {
                    // Encrypt the message
                    string encryptedMessage = _encryptionService.Encrypt(message);

                    // Save the encrypted message
                    var messageToSave = new Message
                    {
                        Content = encryptedMessage,
                        UserId = senderUserId,
                        GroupChatId = groupId,
                        SentAt = DateTime.UtcNow
                    };

                    var savedMessage = await SaveGroupMessageAsync(groupId, senderUserId, encryptedMessage);

                    if (savedMessage == null)
                    {
                        await Clients.Caller.SendAsync("Error", "Failed to save message");
                        return;
                    }

                    // Log successful save
                    _logger.LogInformation("Message saved successfully for group {GroupId}", groupId);

                    // Send the original (unencrypted) message to all group members
                    await Clients.Group(groupId).SendAsync("ReceiveGroupMessage",
    senderUserId,
    senderUsername,
    _encryptionService.Decrypt(encryptedMessage),  // Decrypt before sending
    groupId);

                    // Log successful broadcast
                    _logger.LogInformation("Message broadcast to group {GroupId}", groupId);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error processing group message for group {GroupId}", groupId);
                    await Clients.Caller.SendAsync("Error", "Failed to process message");
                }

                _telemetryClient.TrackEvent("GroupMessageSent", new Dictionary<string, string>
            {
                { "SenderId", Context.UserIdentifier ?? "unknown" },
                { "GroupId", groupId }
            });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error in SendMessageToGroup");
                success = false;
                _telemetryClient.TrackException(ex, new Dictionary<string, string>
            {
                { "SenderId", Context.UserIdentifier ?? "unknown" },
                { "GroupId", groupId }
            });
                await Clients.Caller.SendAsync("Error", "An unexpected error occurred");
            }
            finally
            {
                _telemetryClient.TrackRequest(
                    "SendGroupMessage",
                    startTime,
                    DateTime.UtcNow - startTime,
                    success ? "200" : "500",
                    success);
            }
        }

        private async Task<Message> SaveGroupMessageAsync(string groupId, string senderUserId, string encryptedContent)
        {
            try
            {
                var message = new Message
                {
                    Content = encryptedContent,  // Store encrypted content
                    UserId = senderUserId,
                    GroupChatId = groupId,
                    SentAt = DateTime.UtcNow
                };

                var savedMessage = await _chatService.SaveGroupMessageAsync(groupId, message);

                if (savedMessage != null)
                {
                    _logger.LogInformation("Group message saved successfully for group {GroupId}", groupId);
                }
                else
                {
                    _logger.LogWarning("Failed to save group message for group {GroupId}", groupId);
                }

                return savedMessage;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error saving group message to database for group {GroupId}", groupId);
                return null;
            }
        }

        public async Task<IEnumerable<MessageDto>> GetGroupMessagesAsync(string groupId)
        {
            try
            {
                var messages = await _chatService.GetGroupMessagesAsync(groupId);
                var decryptedMessages = messages.Select(m => new MessageDto
                {
                    MessageId = m.MessageId,
                    Content = _encryptionService.Decrypt(m.Content), // Make sure this is called
                    UserId = m.UserId,
                    GroupChatId = m.GroupChatId,
                    SentAt = m.SentAt,
                }).ToList(); // Materialize the query

                return decryptedMessages;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving and decrypting group messages for group {GroupId}", groupId);
                throw;
            }
        }




        public override async Task OnConnectedAsync()
        {
            try
            {
                var startTime = DateTime.UtcNow;
                TrackConnectedUser();

                _telemetryClient.TrackEvent("UserConnected", new Dictionary<string, string>
            {
                { "UserId", Context.UserIdentifier ?? "unknown" },
                { "ConnectionId", Context.ConnectionId }
            });

                await base.OnConnectedAsync();
            }
            catch (Exception ex)
            {
                _telemetryClient.TrackException(ex);
                throw;
            }
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            try
            {
                RemoveDisconnectedUser();

                _telemetryClient.TrackEvent("UserDisconnected", new Dictionary<string, string>
            {
                { "UserId", Context.UserIdentifier ?? "unknown" },
                { "ConnectionId", Context.ConnectionId }
            });

                if (exception != null)
                {
                    _telemetryClient.TrackException(exception);
                }

                await base.OnDisconnectedAsync(exception);
            }
            catch (Exception ex)
            {
                _telemetryClient.TrackException(ex);
                throw;
            }
        }

        // Private helper methods
        private static bool IsInvalidMessage(string recipientUserId, string messageContent, out string errorMessage)
        {
            errorMessage = string.Empty;
            if (string.IsNullOrWhiteSpace(messageContent) || string.IsNullOrWhiteSpace(recipientUserId))
            {
                errorMessage = "Message content or recipient is invalid.";
                return true;
            }
            return false;
        }

        private async Task HandleMessageSending(string recipientUserId, MessageDto messageDto)
        {
            if (string.IsNullOrWhiteSpace(recipientUserId) || messageDto == null)
            {
                _logger.LogWarning("Attempted to send a message with invalid parameters.");
                throw new ArgumentException("Recipient user ID and message must be provided.");
            }

            var senderUsername = (await _userService.GetUserByIdAsync(messageDto.UserId))?.Username ?? "Unknown";

            // Decrypt for logging (optional, might want to skip this in production)
            string decryptedContent = _encryptionService.Decrypt(messageDto.Content);
            _logger.LogInformation("Sending message from {SenderUsername} to {RecipientUserId}: {Content}",
                senderUsername, recipientUserId, decryptedContent);

            var message = new Message
            {
                Content = messageDto.Content, // Keep encrypted content
                UserId = messageDto.UserId,
                SentAt = DateTime.UtcNow,
                IsQueued = false,
                IsDelivered = false
            };

            bool isGroupChat = !string.IsNullOrEmpty(messageDto.GroupChatId);

            if (isGroupChat)
            {
                message.GroupChatId = messageDto.GroupChatId;
                await _chatService.SaveGroupMessageAsync(message.GroupChatId, message);
            }
            else
            {
                if (messageDto.ChatRoomId.HasValue)
                {
                    await _chatService.SavePrivateMessageAsync(messageDto.ChatRoomId.Value, message);
                }
                else
                {
                    throw new ArgumentException("Invalid recipient user ID; ChatRoomId cannot be null.");
                }
            }

            // When sending to the client, decrypt the message
            if (_connectedUsers.TryGetValue(recipientUserId, out string connectionId))
            {
                // Decrypt before sending to client
                string decryptedMessage = _encryptionService.Decrypt(message.Content);
                await Clients.Client(connectionId).SendAsync("ReceivePrivateMessage",
                    message.UserId, senderUsername, decryptedMessage, messageDto.ChatRoomId);
            }
            else
            {
                await _chatService.QueueMessageForOfflineUserAsync(message, recipientUserId);
            }
        }
        private static bool IsValidGroupMessage(string groupId, string message)
        {
            return !string.IsNullOrEmpty(groupId) && !string.IsNullOrEmpty(message);
        }

        private void TrackConnectedUser()
        {
            string userId = Context.UserIdentifier;
            if (!string.IsNullOrEmpty(userId))
            {
                _connectedUsers[userId] = Context.ConnectionId;
            }
        }

        private void RemoveDisconnectedUser()
        {
            string userId = Context.UserIdentifier;
            if (!string.IsNullOrEmpty(userId))
            {
                _connectedUsers.TryRemove(userId, out _);
            }
        }

        public async Task AddUserToGroup(string groupId, string userId)
        {
            if (string.IsNullOrEmpty(groupId) || string.IsNullOrEmpty(userId))
            {
                throw new ArgumentException("Group ID and user ID cannot be null or empty.");
            }

            // Add the user to the SignalR group
            await Groups.AddToGroupAsync(userId, groupId);

            // Optionally send a message to the group that the user has been added
            await Clients.Group(groupId).SendAsync("UserAddedToGroup", userId);
        }


        // Existing methods...

        // New method to list members of a group by groupId
        public async Task<List<string>> GetGroupMembersAsync(string groupId)
        {
            // Fetch group members (assuming this returns IEnumerable<GroupChatMember>)
            var members = await _chatService.GetGroupMembersAsync(groupId);

            // Check for null or empty members
            if (members == null || !members.Any())
            {
                return new List<string>();
            }

            // Extract the user IDs (or other desired properties)
            var memberIds = members.Select(m => m.UserId).ToList();

            return memberIds;
        }


        // New method to add all members of a group to the SignalR group
        public async Task AddAllMembersToSignalRGroup(string groupId)
        {
            // Fetch members of the group
            var members = await GetGroupMembersAsync(groupId);

            if (members == null || members.Count == 0)
            {
                return;
            }

            // Add each member to the SignalR group
            foreach (var memberId in members)
            {
                // Check if the user is connected (this could be done via your _connectedUsers dictionary)
                if (_connectedUsers.TryGetValue(memberId, out string connectionId))
                {
                    // Add them to the group
                    await Groups.AddToGroupAsync(connectionId, groupId);
                }
            }
        }

        // Method to handle when a user joins the group
        public async Task JoinGroup(string groupId)
        {
            try
            {
                if (string.IsNullOrEmpty(groupId))
                {
                    throw new ArgumentException("Group ID cannot be null or empty");
                }

                await Groups.AddToGroupAsync(Context.ConnectionId, groupId);

                if (!_groupMembers.ContainsKey(groupId))
                {
                    _groupMembers[groupId] = new HashSet<string>();
                }

                _groupMembers[groupId].Add(Context.ConnectionId);

                try
                {
                    // Get and decrypt messages
                    var messages = await _chatService.GetGroupMessagesAsync(groupId);
                    var decryptedMessages = messages.Select(m => new MessageDto
                    {
                        MessageId = m.MessageId,
                        Content = _encryptionService.Decrypt(m.Content), // Decrypt content
                        UserId = m.UserId,
                        GroupChatId = m.GroupChatId,
                        SentAt = m.SentAt
                    });

                    await Clients.Caller.SendAsync("LoadGroupMessages", groupId, decryptedMessages);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error loading messages for group {GroupId}", groupId);
                    await Clients.Caller.SendAsync("Error", "Failed to load group messages");
                }

                await AddAllMembersToSignalRGroup(groupId);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in JoinGroup for group {GroupId}", groupId);
                throw;
            }
        }

        // Method to handle when a user leaves the group
        public async Task LeaveGroup(string groupId)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, groupId);

            // Remove the connection from the group's members list
            if (_groupMembers.ContainsKey(groupId))
            {
                _groupMembers[groupId].Remove(Context.ConnectionId);

                if (_groupMembers[groupId].Count == 0)
                {
                    _groupMembers.Remove(groupId); // Clean up if no one is in the group
                }
            }

        }


        public static Task<HashSet<string>> GetCurrentGroupMembersAsync(string groupId)
        {
            if (_groupMembers.TryGetValue(groupId, out var members))
            {
                return Task.FromResult(members);
            }
            return Task.FromResult(new HashSet<string>());
        }

        public static void AddMemberToGroupTracking(string groupId, string userId)
        {
            if (!_groupMembers.ContainsKey(groupId))
            {
                _groupMembers[groupId] = new HashSet<string>();
            }

            _groupMembers[groupId].Add(userId);
        }

        public static void RemoveMemberFromGroupTracking(string groupId, string userId)
        {
            if (_groupMembers.ContainsKey(groupId))
            {
                _groupMembers[groupId].Remove(userId);

                // Remove the group from tracking if it becomes empty
                if (_groupMembers[groupId].Count == 0)
                {
                    _groupMembers.Remove(groupId);
                }
            }
        }

        public async Task EnsureGroupMembersAdded(string groupId)
        {
            // Check if the group already has members
            var currentGroupMembers = await GetCurrentGroupMembersAsync(groupId);

            if (currentGroupMembers == null || currentGroupMembers.Count == 0)
            {
                await AddAllMembersToSignalRGroup(groupId);
            }
        }



        // Add other existing methods...
    }



}

