

using StudyProductivityApp.Core.Models;

namespace StudyProductivityApp.Core.Interfaces.ServiceInterfaces
{
    public interface IUserFileService
    {
        Task<IEnumerable<UserFile>> GetRootFilesByUserIdAsync(string userId);
        Task<IEnumerable<UserFile>> GetFilesByParentFolderIdAsync(int parentFolderId, string userId);
        Task AddFileAsync(UserFile file);
        Task UpdateFileAsync(UserFile file);
        Task DeleteFileForUserAsync(int fileId, string userId, bool deleteForEveryone = false);
        Task<IEnumerable<UserFileAccess>> GetFileAccessesAsync(int fileId);
        Task AddFileAccessAsync(UserFileAccess fileAccess);
        Task RemoveFileAccessAsync(int fileId, string userId);
        Task<IEnumerable<Folder>> GetRootFoldersByUserIdAsync(string userId);
        Task<IEnumerable<Folder>> GetFoldersByParentFolderIdAsync(int parentFolderId, string userId);
        Task<Folder> CreateFolderAsync(Folder folder);
        Task<bool> DeleteFolderAsync(int folderId);
        Task<bool> RenameFolderAsync(int folderId, string newName);
        Task<UserFile> GetFileByUserIdAsync(int fileId, string userId);
        Task<UserFileAccess> ShareFileAccessAsync(int userFileId, string sharedWithUserId, string sharedByUserId);
        Task<List<UserFileAccess>> GetFileAccessByUserAsync(string userId);
        Task<bool> RevokeFileAccessAsync(int userFileId, string sharedWithUserId);

    }
}