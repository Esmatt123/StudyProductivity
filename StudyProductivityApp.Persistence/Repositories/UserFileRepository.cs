using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using StudyProductivityApp.Core.Interfaces;
using StudyProductivityApp.Core.Models;
using StudyProductivityApp.Persistence.Data;
using Azure.Storage.Blobs;
using Azure.Storage.Sas;
using StudyProductivityApp.Core.Models.Dtos;
using Azure.Storage;


namespace StudyProductivityApp.Persistence.Repositories
{
    public class UserFileRepository : IUserFileRepository
    {
        private readonly StudyProductivityDbContext _context;
        private readonly IConfiguration _configuration;
        private readonly BlobContainerClient _containerClient;
        private readonly StorageSharedKeyCredential _storageCredentials;
        private readonly string _storageAccountName;
        private StudyProductivityDbContext context;

        public UserFileRepository(StudyProductivityDbContext context, IConfiguration configuration, BlobServiceClient blobServiceClient)
        {
            _configuration = configuration;
            _context = context;

            string containerName = _configuration.GetValue<string>("uploadsContainerName");

            // Get the account name from the BlobServiceClient
            _storageAccountName = blobServiceClient.AccountName;

            // Get the account key from configuration
            string accountKey = _configuration.GetValue<string>("StudyProdStorageAcc-AccountKey");

            // Initialize storage credentials
            _storageCredentials = new StorageSharedKeyCredential(_storageAccountName, accountKey);

            // Initialize container client
            _containerClient = blobServiceClient.GetBlobContainerClient(containerName);
            _containerClient.CreateIfNotExists();
        }

        public UserFileRepository(StudyProductivityDbContext context)
        {
            this.context = context;
        }

        public async Task<IEnumerable<UserFile>> GetRootFilesByUserIdAsync(string userId)
        {
            try
            {
                // Retrieve files from the database
                var userFiles = await _context.UserFiles
                    .Where(uf => uf.UploadedByUserId == userId && uf.FolderId == null)
                    .ToListAsync();

                foreach (var userFile in userFiles)
                {
                    try
                    {
                        // Get a reference to the blob using the FilePath (which should contain the blob name)
                        BlobClient blobClient = _containerClient.GetBlobClient(userFile.FilePath);

                        // Generate SAS URI for the file
                        var sasUri = GenerateBlobSasUri(blobClient, BlobSasPermissions.Read, DateTimeOffset.UtcNow.AddHours(1));

                        // Update the SasUri property
                        userFile.SasUri = sasUri;
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine($"Error generating SAS URI for file {userFile.FileName}: {ex.Message}");
                    }
                }

                return userFiles;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in GetRootFilesByUserIdAsync: {ex.Message}");
                throw;
            }
        }

        private string ExtractBlobName(string filePath)
        {
            var blobUri = new Uri(filePath);
            // Remove the leading '/' from the path
            return blobUri.LocalPath.TrimStart('/');
        }

        private string GenerateBlobSasUri(string blobName, BlobSasPermissions permissions, DateTimeOffset expiresOn)
        {
            // Get a reference to the blob
            BlobClient blobClient = _containerClient.GetBlobClient(blobName);

            // Build the SAS token
            BlobSasBuilder sasBuilder = new BlobSasBuilder
            {
                BlobContainerName = _containerClient.Name,
                BlobName = blobName,
                Resource = "b",
                StartsOn = DateTimeOffset.UtcNow.AddMinutes(-5),
                ExpiresOn = expiresOn
            };

            sasBuilder.SetPermissions(permissions);

            // Generate the SAS token using the storage credentials
            var sasToken = sasBuilder.ToSasQueryParameters(_storageCredentials).ToString();

            // Build the full URI including the SAS token
            var sasUri = $"{blobClient.Uri}?{sasToken}";

            return sasUri;
        }

        public async Task<IEnumerable<UserFile>> GetFilesByParentFolderIdAsync(int parentFolderId, string userId)
        {
            try
            {
                // Retrieve files from the database
                var userFiles = await _context.UserFiles
                    .Where(uf => uf.UploadedByUserId == userId && uf.FolderId == parentFolderId)
                    .ToListAsync();

                foreach (var userFile in userFiles)
                {
                    try
                    {
                        // Get a reference to the blob using the FilePath (which should contain the blob name)
                        BlobClient blobClient = _containerClient.GetBlobClient(userFile.FilePath);

                        // Generate SAS URI for the file
                        var sasUri = GenerateBlobSasUri(blobClient, BlobSasPermissions.Read, DateTimeOffset.UtcNow.AddHours(1));

                        // Update the SasUri property
                        userFile.SasUri = sasUri;
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine($"Error generating SAS URI for file {userFile.FileName}: {ex.Message}");
                    }
                }

                return userFiles;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in GetFilesByParentFolderIdAsync: {ex.Message}");
                throw;
            }
        }

        public async Task AddFileAsync(UserFile file)
        {
            try
            {
                // Get a reference to the blob
                BlobClient blobClient = _containerClient.GetBlobClient(file.FilePath);

                // Generate new SAS URI before saving to database
                var sasUri = GenerateBlobSasUri(blobClient, BlobSasPermissions.Read, DateTimeOffset.UtcNow.AddHours(1));

                // Update the SasUri property
                file.SasUri = sasUri;

                // If there's a thumbnail, generate its SAS URI too
                if (!string.IsNullOrEmpty(file.ThumbnailPath))
                {
                    var thumbnailBlobClient = _containerClient.GetBlobClient(file.ThumbnailPath);
                    var thumbnailSasUri = GenerateBlobSasUri(thumbnailBlobClient, BlobSasPermissions.Read, DateTimeOffset.UtcNow.AddHours(1));
                }

                // Add the file to the database
                await _context.UserFiles.AddAsync(file);
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                // Log the error
                Console.WriteLine($"Error in AddFileAsync: {ex.Message}");
                throw;
            }
        }

        private string GenerateBlobSasUri(BlobClient blobClient, BlobSasPermissions permissions, DateTimeOffset expiresOn)
        {
            try
            {
                // Build the SAS token
                BlobSasBuilder sasBuilder = new BlobSasBuilder
                {
                    BlobContainerName = blobClient.BlobContainerName,
                    BlobName = blobClient.Name,
                    Resource = "b",
                    StartsOn = DateTimeOffset.UtcNow.AddMinutes(-5),
                    ExpiresOn = expiresOn
                };

                sasBuilder.SetPermissions(permissions);

                // Generate the SAS URI using the storage credentials
                Uri sasUri = blobClient.GenerateSasUri(sasBuilder);

                return sasUri.ToString();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error generating SAS URI: {ex.Message}");
                throw;
            }
        }

        public async Task UpdateFileAsync(UserFile file)
        {
            _context.UserFiles.Update(file);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteFileForUserAsync(int fileId, string userId, bool deleteForEveryone = false)
        {
            var file = await _context.UserFiles
                .Include(f => f.UserFileAccesses)
                .FirstOrDefaultAsync(f => f.UserFileId == fileId);

            if (file == null)
                throw new Exception("File not found.");

            // Store the blob name to delete it from Azure later
            string blobName = file.FilePath; // Assuming FilePath stores the blob name

            // Scenario 1: If the user is the uploader (owner)
            if (file.UploadedByUserId == userId)
            {
                // Remove all access records and the file itself
                _context.UserFileAccesses.RemoveRange(file.UserFileAccesses);
                _context.UserFiles.Remove(file);

                // Delete the blob from Azure Blob Storage
                await DeleteBlobAsync(blobName);
            }
            else
            {
                // Scenario 2: If the user is a secondary sharer
                var userAccess = file.UserFileAccesses
                    .Where(fa => fa.SharedWithUserId == userId)
                    .ToList();

                if (!userAccess.Any())
                    throw new Exception("You do not have access to this file.");

                // Remove access for the current user
                _context.UserFileAccesses.RemoveRange(userAccess);

                if (deleteForEveryone)
                {
                    // Also remove access records shared by this user
                    var sharedByUser = file.UserFileAccesses
                        .Where(fa => fa.SharedByUserId == userId)
                        .ToList();
                    _context.UserFileAccesses.RemoveRange(sharedByUser);
                }
            }

            // Save changes
            await _context.SaveChangesAsync();
        }

        // Helper method to delete blob from Azure Blob Storage
        private async Task DeleteBlobAsync(string blobName)
        {
            try
            {
                BlobClient blobClient = _containerClient.GetBlobClient(blobName);
                await blobClient.DeleteIfExistsAsync();
            }
            catch (Exception ex)
            {
                // Handle exceptions as needed
                Console.WriteLine($"Error deleting blob: {ex.Message}");
                // Optionally, log the error or rethrow
            }
        }

        public async Task<IEnumerable<UserFileAccess>> GetFileAccessesAsync(int fileId)
        {
            return await _context.UserFileAccesses
                .Where(ufa => ufa.UserFileId == fileId)
                .ToListAsync();
        }

        public async Task AddFileAccessAsync(UserFileAccess fileAccess)
        {
            await _context.UserFileAccesses.AddAsync(fileAccess);
            await _context.SaveChangesAsync();
        }

        public async Task RemoveFileAccessAsync(int fileId, string userId)
        {
            var access = await _context.UserFileAccesses
                .FirstOrDefaultAsync(ufa => ufa.UserFileId == fileId && ufa.SharedWithUserId == userId);

            if (access != null)
            {
                _context.UserFileAccesses.Remove(access);
                await _context.SaveChangesAsync();
            }
        }


        public async Task<IEnumerable<Folder>> GetRootFoldersByUserIdAsync(string userId)
        {
            return await _context.Folders
                .Where(f => f.UserId == userId && f.ParentFolderId == null)
                .Include(f => f.SubFolders) // If you want to load immediate subfolders
                .Include(f => f.Files) // If you want to load immediate files
                .ToListAsync();
        }

        public async Task<IEnumerable<Folder>> GetFoldersByParentFolderIdAsync(int parentFolderId, string userId)
        {
            return await _context.Folders
                .Where(f => f.UserId == userId && f.ParentFolderId == parentFolderId)
                .Include(f => f.SubFolders) // If you want to load subfolders
                .Include(f => f.Files) // If you want to load files
                .ToListAsync();
        }



        public async Task<Folder> CreateFolderAsync(Folder folder)
        {
            await _context.Folders.AddAsync(folder);
            await _context.SaveChangesAsync();
            return folder;
        }

        // Method to delete a folder
        public async Task<bool> DeleteFolderAsync(int folderId)
        {
            var transactionSupported = _context.Database.ProviderName != "Microsoft.EntityFrameworkCore.InMemory";

            using var transaction = transactionSupported
                ? await _context.Database.BeginTransactionAsync()
                : null;

            try
            {
                var folder = await _context.Folders
                    .Include(f => f.Files)
                    .Include(f => f.SubFolders)
                    .FirstOrDefaultAsync(f => f.FolderId == folderId);

                if (folder == null) return false;

                // Recursively delete subfolders (if any)
                if (folder.SubFolders != null && folder.SubFolders.Any())
                {
                    await DeleteSubfoldersAsync(folder.SubFolders);
                }

                // Delete files in the folder (if any)
                if (folder.Files != null && folder.Files.Any())
                {
                    _context.UserFiles.RemoveRange(folder.Files);
                }

                // Delete the folder itself
                _context.Folders.Remove(folder);

                await _context.SaveChangesAsync();
                if (transaction != null) await transaction.CommitAsync();
                return true;
            }
            catch
            {
                if (transaction != null) await transaction.RollbackAsync();
                throw;
            }
        }


        private async Task DeleteSubfoldersAsync(IEnumerable<Folder> subfolders)
        {
            foreach (var subfolder in subfolders)
            {
                // Load subfolder details
                var fullSubfolder = await _context.Folders
                    .Include(f => f.Files)
                    .Include(f => f.SubFolders)
                    .FirstOrDefaultAsync(f => f.FolderId == subfolder.FolderId);

                if (fullSubfolder != null)
                {
                    // Recursively delete subfolders
                    if (fullSubfolder.SubFolders != null && fullSubfolder.SubFolders.Any())
                    {
                        await DeleteSubfoldersAsync(fullSubfolder.SubFolders);
                    }

                    // Delete files in the subfolder (if any)
                    if (fullSubfolder.Files != null && fullSubfolder.Files.Any())
                    {
                        _context.UserFiles.RemoveRange(fullSubfolder.Files);
                    }

                    // Delete the subfolder
                    _context.Folders.Remove(fullSubfolder);
                }
            }
        }


        // Method to rename a folder
        public async Task<bool> RenameFolderAsync(int folderId, string newName)
        {
            if (string.IsNullOrWhiteSpace(newName))
                throw new ArgumentException("Folder name cannot be empty", nameof(newName));

            var folder = await _context.Folders.FirstOrDefaultAsync(f => f.FolderId == folderId);
            if (folder == null) return false;

            folder.Name = newName;
            await _context.SaveChangesAsync();
            return true;
        }




        public async Task<UserFile> GetFileByUserIdAsync(int fileId, string userId)
        {
            var file = await _context.UserFiles
                .Where(f => f.UserFileId == fileId && f.UploadedByUserId == userId)
                .FirstOrDefaultAsync() ?? throw new FileNotFoundException($"File with ID {fileId} not found for user {userId}.");
            return file;
        }

        public async Task<UserFileAccess> ShareFileAccessAsync(int userFileId, string sharedWithUserId, string sharedByUserId)
        {
            var userFile = await _context.UserFiles.FindAsync(userFileId);
            var sharedWithUser = await _context.Users.FindAsync(sharedWithUserId);
            var sharedByUser = await _context.Users.FindAsync(sharedByUserId);

            if (userFile == null || sharedWithUser == null || sharedByUser == null)
                throw new Exception("User file or users not found.");

            // Generate a SAS token for the shared user
            var sharedAccessExpiryTime = DateTimeOffset.UtcNow.AddDays(7); // Adjust as needed
            string blobName = userFile.FilePath; // Ensure this is the blob name
            string sasUri = GenerateUserDelegationSasUri(blobName, sharedAccessExpiryTime);

            var userFileAccess = new UserFileAccess
            {
                UserFileId = userFileId,
                SharedWithUserId = sharedWithUserId,
                SharedByUserId = sharedByUserId, // Set the sharer
                UserFile = userFile,
                SharedWithUser = sharedWithUser,
                SharedByUser = sharedByUser,
                SasUri = sasUri
            };

            _context.UserFileAccesses.Add(userFileAccess);
            await _context.SaveChangesAsync();

            return userFileAccess;
        }

        private string GenerateUserDelegationSasUri(string blobName, DateTimeOffset expiresOn)
        {
            BlobClient blobClient = _containerClient.GetBlobClient(blobName);

            BlobSasBuilder sasBuilder = new BlobSasBuilder
            {
                BlobContainerName = _containerClient.Name,
                BlobName = blobName,
                Resource = "b", // Blob
                StartsOn = DateTimeOffset.UtcNow.AddMinutes(-5),
                ExpiresOn = expiresOn
            };

            sasBuilder.SetPermissions(BlobSasPermissions.Read);

            // Generate the SAS token
            Uri sasUri = blobClient.GenerateSasUri(sasBuilder);
            return sasUri.ToString();
        }


        // Method to get file access for a user
        public async Task<List<UserFileAccess>> GetFileAccessByUserAsync(string userId)
        {
            return await _context.UserFileAccesses
                .Include(u => u.UserFile)
                .Include(u => u.SharedWithUser)
                .Include(u => u.SharedByUser) // Include sharer information
                .Where(u => u.SharedWithUserId == userId)
                .Select(u => new UserFileAccess
                {
                    UserFileAccessId = u.UserFileAccessId,
                    UserFileId = u.UserFileId,
                    SharedWithUserId = u.SharedWithUserId,
                    SharedByUserId = u.SharedByUserId,
                    UserFile = u.UserFile,
                    SharedWithUser = u.SharedWithUser,
                    SharedByUser = u.SharedByUser,
                    SasUri = u.SasUri // Include the SAS URI
                })
                .ToListAsync();
        }


        // Method to revoke file access
        public async Task<bool> RevokeFileAccessAsync(int userFileId, string sharedWithUserId)
        {
            var fileAccess = await _context.UserFileAccesses
                .FirstOrDefaultAsync(u => u.UserFileId == userFileId && u.SharedWithUserId == sharedWithUserId);

            if (fileAccess == null)
                return false;

            _context.UserFileAccesses.Remove(fileAccess);
            await _context.SaveChangesAsync();

            return true;
        }



    }
}
