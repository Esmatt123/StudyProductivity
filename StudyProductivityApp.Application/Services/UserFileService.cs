using StudyProductivityApp.Core.Interfaces;
using StudyProductivityApp.Core.Interfaces.ServiceInterfaces;
using StudyProductivityApp.Core.Models;

namespace StudyProductivityApp.Application.Services
{
    public class UserFileService : IUserFileService
    {
        private readonly IUserFileRepository _userFileRepository;
        public UserFileService(IUserFileRepository userFileRepository)
        {
            _userFileRepository = userFileRepository;
        }

        public async Task AddFileAccessAsync(UserFileAccess fileAccess)
        {
            await _userFileRepository.AddFileAccessAsync(fileAccess);
        }

        public async Task AddFileAsync(UserFile file)
        {
            await _userFileRepository.AddFileAsync(file);
        }

        public Task<Folder> CreateFolderAsync(Folder folder)
        {
            return _userFileRepository.CreateFolderAsync(folder);
        }

        public async Task DeleteFileForUserAsync(int fileId, string userId, bool deleteForEveryone = false)
        {
            await _userFileRepository.DeleteFileForUserAsync(fileId, userId, deleteForEveryone);
        }

        public Task<bool> DeleteFolderAsync(int folderId)
        {
            return _userFileRepository.DeleteFolderAsync(folderId);
        }

        

        public async Task<IEnumerable<UserFileAccess>> GetFileAccessesAsync(int fileId)
        {
            return await _userFileRepository.GetFileAccessesAsync(fileId);
        }

        public async Task<UserFile> GetFileByUserIdAsync(int fileId, string userId)
        {
            return await _userFileRepository.GetFileByUserIdAsync(fileId, userId);
        }

        public async Task<IEnumerable<UserFile>> GetFilesByParentFolderIdAsync(int parentFolderId, string userId)
        {
            return await _userFileRepository.GetFilesByParentFolderIdAsync(parentFolderId, userId);
        }

        public async Task<IEnumerable<Folder>> GetFoldersByParentFolderIdAsync(int parentFolderId, string userId)
        {
            return await _userFileRepository.GetFoldersByParentFolderIdAsync(parentFolderId, userId);
        }

        public async Task<IEnumerable<UserFile>> GetRootFilesByUserIdAsync(string userId)
        {
            return await _userFileRepository.GetRootFilesByUserIdAsync(userId);
        }

        public async Task<IEnumerable<Folder>> GetRootFoldersByUserIdAsync(string userId)
        {
             return await _userFileRepository.GetRootFoldersByUserIdAsync(userId);
        }

        public async Task RemoveFileAccessAsync(int fileId, string userId)
        {
            await _userFileRepository.RemoveFileAccessAsync(fileId, userId);
        }

        public Task<bool> RenameFolderAsync(int folderId, string newName)
        {
            return _userFileRepository.RenameFolderAsync(folderId, newName);
        }

        public async Task UpdateFileAsync(UserFile file)
        {
            await _userFileRepository.UpdateFileAsync(file);
        }

        public async Task<UserFileAccess> ShareFileAccessAsync(int userFileId, string sharedWithUserId, string sharedByUserId)
    {
        return await _userFileRepository.ShareFileAccessAsync(userFileId, sharedWithUserId,sharedByUserId);
    }

    // Method to get all file accesses for a user
    public async Task<List<UserFileAccess>> GetFileAccessByUserAsync(string userId)
    {
        return await _userFileRepository.GetFileAccessByUserAsync(userId);
    }

    // Method to revoke file access
    public async Task<bool> RevokeFileAccessAsync(int userFileId, string sharedWithUserId)
    {
        return await _userFileRepository.RevokeFileAccessAsync(userFileId, sharedWithUserId);
    }
    }
}