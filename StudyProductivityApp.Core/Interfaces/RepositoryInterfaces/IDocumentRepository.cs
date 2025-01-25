using StudyProductivityApp.Core.Models;
using StudyProductivityApp.Core.Models.Dtos;

namespace StudyProductivityApp.Core.Interfaces.RepositoryInterfaces
{
    public interface IDocumentRepository
    {
        Task<Document> FindOrCreateDocumentAsync(string documentId, string documentName, string ownerId);
        Task SaveDocumentAsync(string documentId, string data);
        Task<List<Document>> GetAllDocumentsAsync();
        Task<Document> GetDocumentByIdAsync(string documentId, string userId);
        Task UpdateDocumentAsync(string documentId, string Name);
        Task DeleteDocumentAsync(string id, string userId);
        Task<Document> ShareDocumentAsync(string documentId, string email, bool canWrite, string sharedByUserId);
        Task<IEnumerable<Document>> GetUserAccessibleDocumentsAsync(string userId);
        Task<List<Document>> GetDocumentsForUserAsync(string userId);
        Task<bool> GetUserCanReadPermissionAsync(string documentId, string userId);
        Task<bool> GetUserCanWritePermissionAsync(string documentId, string userId);

    }
}
