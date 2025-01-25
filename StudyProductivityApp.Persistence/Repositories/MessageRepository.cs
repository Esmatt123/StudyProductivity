

using Microsoft.EntityFrameworkCore;
using StudyProductivityApp.Core.Interfaces.RepositoryInterfaces;
using StudyProductivityApp.Core.Interfaces.ServiceInterfaces;
using StudyProductivityApp.Core.Models;
using StudyProductivityApp.Persistence.Data;

namespace StudyProductivityApp.Persistence.Repositories
{
    public class MessageRepository : IMessageRepository
    {
        private readonly StudyProductivityDbContext _context;
        private readonly IEncryptionService _encryptionService;

        public MessageRepository(StudyProductivityDbContext context, IEncryptionService encryptionService)
        {
            _context = context;
            _encryptionService = encryptionService;
        }

        public async Task<Message> CreateMessageAsync(Message message)
        {
            if (message == null)
            {
                throw new ArgumentNullException(nameof(message));
            }

            // Encrypt the message content before saving
            message.Content = _encryptionService.Encrypt(message.Content);

            _context.Messages.Add(message);
            await _context.SaveChangesAsync();
            return message;
        }

        public async Task<IEnumerable<Message>> GetMessagesByChatRoomIdAsync(int chatRoomId)
        {
            var messages = await _context.Messages
                .Where(m => m.ChatRoomId == chatRoomId)
                .ToListAsync();

            // Decrypt messages before returning
            foreach (var message in messages)
            {
                message.Content = _encryptionService.Decrypt(message.Content);
            }

            return messages;
        }

        public async Task<IEnumerable<Message>> GetMessagesByGroupIdAsync(string groupId)
        {
            return await _context.Messages
                .Where(m => m.GroupChatId == groupId)
                .OrderBy(m => m.SentAt)
                .ToListAsync();
        }
    }
}