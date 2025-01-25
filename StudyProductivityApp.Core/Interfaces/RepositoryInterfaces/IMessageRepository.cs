using StudyProductivityApp.Core.Models;

namespace StudyProductivityApp.Core.Interfaces.RepositoryInterfaces
{
    public interface IMessageRepository
    {
        Task<Message> CreateMessageAsync(Message message);
        Task<IEnumerable<Message>> GetMessagesByChatRoomIdAsync(int chatRoomId);
        Task<IEnumerable<Message>> GetMessagesByGroupIdAsync(string groupId);
    }
}