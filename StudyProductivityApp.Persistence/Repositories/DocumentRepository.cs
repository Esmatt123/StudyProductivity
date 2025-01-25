using StudyProductivityApp.Core.Interfaces.RepositoryInterfaces;
using StudyProductivityApp.Core.Models;
using StudyProductivityApp.Persistence.Data;
using Microsoft.EntityFrameworkCore;
using AutoMapper;

namespace StudyProductivityApp.Persistence.Repositories
{
    public class DocumentRepository : IDocumentRepository
    {
        private readonly StudyProductivityDbContext _context;
        private readonly IMapper _mapper;

        public DocumentRepository(StudyProductivityDbContext context, IMapper mapper)
        {
            _mapper = mapper;
            _context = context;
        }

        public async Task<bool> GetUserCanReadPermissionAsync(string documentId, string userId)
        {
            var document = await _context.Documents
                .Include(d => d.Shares)
                .FirstOrDefaultAsync(d => d.Id == documentId);

            if (document == null)
            {
                throw new Exception("Document not found");
            }

            // If user is the owner, they always have read permission
            if (document.OwnerId == userId)
            {
                return true;
            }

            // Find the share entry for the user
            var share = document.Shares.FirstOrDefault(s => s.UserId == userId);
            if (share == null)
            {
                return false; // No access if no share exists
            }

            return share.CanRead;
        }



        public async Task<Document?> FindOrCreateDocumentAsync(string documentId, string documentName, string ownerId)
        {
            if (string.IsNullOrEmpty(documentId))
                return null;

            // Try to find the document by its ID
            var document = await _context.Documents
                .Include(d => d.Shares)
                .FirstOrDefaultAsync(d => d.Id == documentId);

            // If not found, create a new document
            if (document == null)
            {
                var ownerUser = await _context.Users.FindAsync(ownerId);
                if (ownerUser == null)
                    throw new Exception("Owner user not found");

                document = new Document
                {
                    Id = documentId,
                    Name = documentName ?? "Untitled Document",
                    OwnerId = ownerId,
                    Data = "",
                    Owner = ownerUser,
                    CanRead = true,
                    Shares = new List<DocumentShare>
            {
                new DocumentShare
                {
                    Id = Guid.NewGuid().ToString(),
                    DocumentId = documentId,
                    UserId = ownerId,
                    CanRead = true,
                    CanWrite = true,
                    SharedByUserId = ownerId,
                    Email = ownerUser.Email
                }
            }
                };

                _context.Documents.Add(document);
                await _context.SaveChangesAsync();
            }
            else
            {
                // Ensure owner has proper permissions if document exists
                var ownerShare = document.Shares.FirstOrDefault(s => s.UserId == ownerId);
                if (ownerShare == null)
                {
                    var ownerUser = await _context.Users.FindAsync(ownerId);
                    document.Shares.Add(new DocumentShare
                    {
                        Id = Guid.NewGuid().ToString(),
                        DocumentId = documentId,
                        UserId = ownerId,
                        CanRead = true,
                        CanWrite = true,
                        SharedByUserId = ownerId,
                        Email = ownerUser?.Email
                    });
                    await _context.SaveChangesAsync();
                }
            }

            return document;
        }


        public async Task SaveDocumentAsync(string documentId, string data)
        {
            try
            {
                var document = await _context.Documents.FindAsync(documentId);
                if (document != null)
                {
                    document.Data = data;
                    await _context.SaveChangesAsync();
                }
                else
                {
                    Console.WriteLine($"Document with ID {documentId} not found.");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error saving document: {ex.Message}");
                throw;
            }
        }

        private async Task EnsureUserHasAccessAsync(string documentId, string userId, bool requireWrite = false)
        {
            var document = await _context.Documents
                .Include(d => d.Shares)
                .FirstOrDefaultAsync(d => d.Id == documentId);

            if (document == null)
                throw new Exception("Document not found");

            if (document.OwnerId == userId)
                return; // Owner has all permissions

            var share = document.Shares.FirstOrDefault(s => s.UserId == userId);
            if (share == null || !share.CanRead || (requireWrite && !share.CanWrite))
                throw new UnauthorizedAccessException("User does not have required permissions");
        }

        public async Task<List<Document>> GetAllDocumentsAsync()
        {
            try
            {
                return await _context.Documents.ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error retrieving documents: {ex.Message}");
                throw;
            }
        }

        // New Update method
        public async Task UpdateDocumentAsync(string documentId, string name)
        {
            try
            {
                var document = await _context.Documents.FindAsync(documentId);
                if (document != null)
                {
                    document.Name = name;
                    _context.Documents.Update(document); // Marks the document as modified
                    await _context.SaveChangesAsync();
                }
                else
                {
                    Console.WriteLine($"Document with ID {documentId} not found.");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error updating document: {ex.Message}");
                throw;
            }
        }

        // New Delete method
        public async Task DeleteDocumentAsync(string id, string userId)
        {
            try
            {
                var document = await _context.Documents
                    .Include(d => d.Shares) // Include related shares
                    .FirstOrDefaultAsync(d => d.Id == id); // Use FirstOrDefault for null checks

                if (document == null)
                {
                    Console.WriteLine($"Document with ID {id} not found.");
                    throw new Exception("Document not found.");
                }

                // Check if the user has permissions to delete (optional)
                // For example, check if the user is the owner of the document
                if (document.OwnerId != userId) // Adjust based on your ownership logic
                {
                    throw new UnauthorizedAccessException("You do not have permission to delete this document.");
                }

                // Remove all shares associated with the document
                var shares = await _context.DocumentShares.Where(s => s.DocumentId == id).ToListAsync();
                _context.DocumentShares.RemoveRange(shares); // Remove all associated shares

                // Now remove the document
                _context.Documents.Remove(document);
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error deleting document: {ex.Message}");
                throw;
            }
        }






        public async Task<Document> GetDocumentByIdAsync(string documentId, string userId)
        {
            await EnsureUserHasAccessAsync(documentId, userId);

            return await _context.Documents
                .Include(d => d.Shares)
                .Include(d => d.Owner)
                .FirstOrDefaultAsync(d => d.Id == documentId)
                ?? throw new Exception("Document not found");
        }






        public async Task<List<Document>> GetDocumentsForUserAsync(string userId)
        {
            return await _context.Documents
                .Include(d => d.Shares)
                .Include(d => d.Owner)
                .Where(d => d.OwnerId == userId || // User is owner
                      d.Shares.Any(s => s.UserId == userId && s.CanRead)) // User has read permission
                .ToListAsync();
        }

        public async Task<IEnumerable<Document>> GetUserAccessibleDocumentsAsync(string userId)
        {
            return await _context.Documents
                .Where(d => d.OwnerId == userId || d.Shares.Any(s => s.UserId == userId))
                .ToListAsync();
        }

        public async Task<Document> ShareDocumentAsync(string documentId, string email, bool canWrite, string sharedByUserId)
        {
            var document = await _context.Documents.FindAsync(documentId);
            if (document == null) throw new Exception("Document not found");

            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
            if (user == null)
            {
                user = new User
                {
                    UserId = Guid.NewGuid().ToString(),
                    Email = email,
                    IsInvited = true
                };
                _context.Users.Add(user);
                await _context.SaveChangesAsync();
            }

            if (document.Shares.Any(share => share.UserId == user.UserId))
                throw new Exception("Document already shared with this user");

            document.Shares.Add(new DocumentShare
            {
                Id = Guid.NewGuid().ToString(),
                UserId = user.UserId,
                CanRead = true, // Always set to true for shared users
                CanWrite = canWrite,
                SharedByUserId = sharedByUserId,
                Email = user.Email
            });

            await _context.SaveChangesAsync();
            return document;
        }



        public async Task<Document> UpdateSharePermissions(string documentId, string userId, bool canRead, bool canWrite)
        {
            var document = await _context.Documents.FindAsync(documentId);
            if (document == null) throw new Exception("Document not found");

            var share = document.Shares.FirstOrDefault(s => s.UserId == userId);
            if (share == null) throw new Exception("User is not shared with this document");

            // Prevent disabling read access for document owner
            if (document.OwnerId == userId)
            {
                canRead = true; // Owner must always have read access
                canWrite = true; // Owner must always have write access
            }
            else
            {
                // For non-owners, ensure write access requires read access
                if (!canRead)
                {
                    canWrite = false;
                }
            }

            share.CanRead = canRead;
            share.CanWrite = canWrite;
            await _context.SaveChangesAsync();

            return document;
        }

        private async Task<bool> IsDocumentOwner(string documentId, string userId)
        {
            var document = await _context.Documents.FindAsync(documentId);
            return document?.OwnerId == userId;
        }


        public async Task<bool> GetUserCanWritePermissionAsync(string documentId, string userId)
        {
            var document = await _context.Documents
                .Include(d => d.Shares)
                .FirstOrDefaultAsync(d => d.Id == documentId);

            if (document == null)
            {
                throw new Exception("Document not found");
            }

            // If user is the owner, they always have write permission
            if (document.OwnerId == userId)
            {
                return true;
            }

            // Find the share entry for the user
            var share = document.Shares.FirstOrDefault(s => s.UserId == userId);
            if (share == null)
            {
                throw new Exception("User does not have access to this document");
            }

            return share.CanWrite;
        }







    }
}

