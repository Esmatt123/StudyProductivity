using AutoMapper;
using Microsoft.EntityFrameworkCore;
using StudyProductivityApp.Core.Models;
using StudyProductivityApp.Persistence.Data;
using StudyProductivityApp.Persistence.Repositories;

namespace StudyProductivityApp.Persistence.Tests
{
    public class DocumentRepositoryTests
    {
        private readonly StudyProductivityDbContext _context;
        private readonly DocumentRepository _repository;
        private readonly IMapper _mapper;

        public DocumentRepositoryTests()
        {
            // Set up AutoMapper
            var mapperConfig = new MapperConfiguration(cfg => { /* Add mapping configurations if any */ });
            _mapper = mapperConfig.CreateMapper();

            // Set up in-memory database
            var options = new DbContextOptionsBuilder<StudyProductivityDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;
            _context = new StudyProductivityDbContext(options);

            // Initialize repository
            _repository = new DocumentRepository(_context, _mapper);
        }

        [Fact]
        public async Task FindOrCreateDocumentAsync_ShouldCreateNewDocument_WhenDocumentDoesNotExist()
        {
            // Arrange
            var documentId = Guid.NewGuid().ToString();
            var documentName = "Test Document";
            var ownerId = "owner1";
            var ownerEmail = "owner@test.com";

            // Create and add the owner user to the context
            var ownerUser = new User
            {
                UserId = ownerId,
                Email = ownerEmail,
                // Add other required user properties
            };
            await _context.Users.AddAsync(ownerUser);
            await _context.SaveChangesAsync();

            // Act
            var document = await _repository.FindOrCreateDocumentAsync(documentId, documentName, ownerId);

            // Assert
            Assert.NotNull(document);
            Assert.Equal(documentId, document.Id);
            Assert.Equal(documentName, document.Name);
            Assert.Equal(ownerId, document.OwnerId);
            Assert.Empty(document.Data);
            Assert.True(document.CanRead);

            // Verify document share was created
            Assert.Single(document.Shares);
            var share = document.Shares.First();
            Assert.Equal(ownerId, share.UserId);
            Assert.Equal(documentId, share.DocumentId);
            Assert.True(share.CanRead);
            Assert.True(share.CanWrite);
            Assert.Equal(ownerId, share.SharedByUserId);
            Assert.Equal(ownerEmail, share.Email);

            // Verify document was saved to database
            var savedDocument = await _context.Documents
                .Include(d => d.Shares)
                .FirstOrDefaultAsync(d => d.Id == documentId);
            Assert.NotNull(savedDocument);
            Assert.Equal(documentName, savedDocument.Name);
            Assert.Single(savedDocument.Shares);
        }

        [Fact]
        public async Task FindOrCreateDocumentAsync_ShouldThrowException_WhenOwnerNotFound()
        {
            // Arrange
            var documentId = Guid.NewGuid().ToString();
            var documentName = "Test Document";
            var nonExistentOwnerId = "nonexistent";

            // Act & Assert
            await Assert.ThrowsAsync<Exception>(() =>
                _repository.FindOrCreateDocumentAsync(documentId, documentName, nonExistentOwnerId));
        }

        [Fact]
        public async Task FindOrCreateDocumentAsync_ShouldAddOwnerShare_WhenDocumentExistsWithoutOwnerShare()
        {
            // Arrange
            var documentId = Guid.NewGuid().ToString();
            var documentName = "Test Document";
            var ownerId = "owner1";
            var ownerEmail = "owner@test.com";

            // Create and add the owner user
            var ownerUser = new User
            {
                UserId = ownerId,
                Email = ownerEmail,
                // Add other required user properties
            };
            await _context.Users.AddAsync(ownerUser);

            // Create document without owner share
            var existingDocument = new Document
            {
                Id = documentId,
                Name = documentName,
                OwnerId = ownerId,
                Data = "",
                CanRead = true,
                Shares = new List<DocumentShare>()
            };
            await _context.Documents.AddAsync(existingDocument);
            await _context.SaveChangesAsync();

            // Act
            var document = await _repository.FindOrCreateDocumentAsync(documentId, documentName, ownerId);

            // Assert
            Assert.NotNull(document);
            Assert.Single(document.Shares);
            var share = document.Shares.First();
            Assert.Equal(ownerId, share.UserId);
            Assert.True(share.CanRead);
            Assert.True(share.CanWrite);
            Assert.Equal(ownerEmail, share.Email);
        }

        [Fact]
        public async Task SaveDocumentAsync_ShouldUpdateDocumentData()
        {
            // Arrange
            var documentId = Guid.NewGuid().ToString();
            var document = new Document
            {
                Id = documentId,
                Name = "Test Document",
                OwnerId = "owner1",
                Data = "Old Data"
            };
            _context.Documents.Add(document);
            await _context.SaveChangesAsync();

            var newData = "Updated Data";

            // Act
            await _repository.SaveDocumentAsync(documentId, newData);

            // Assert
            var updatedDocument = await _context.Documents.FindAsync(documentId);
            Assert.Equal(newData, updatedDocument.Data);
        }

        [Fact]
        public async Task GetAllDocumentsAsync_ShouldReturnAllDocuments()
        {
            // Arrange
            var documents = new List<Document>
            {
                new Document { Id = Guid.NewGuid().ToString(), Name = "Doc 1", OwnerId = "owner1" },
                new Document { Id = Guid.NewGuid().ToString(), Name = "Doc 2", OwnerId = "owner2" },
                new Document { Id = Guid.NewGuid().ToString(), Name = "Doc 3", OwnerId = "owner3" }
            };
            _context.Documents.AddRange(documents);
            await _context.SaveChangesAsync();

            // Act
            var result = await _repository.GetAllDocumentsAsync();

            // Assert
            Assert.Equal(3, result.Count);
            Assert.Contains(result, d => d.Name == "Doc 1");
            Assert.Contains(result, d => d.Name == "Doc 2");
            Assert.Contains(result, d => d.Name == "Doc 3");
        }

        [Fact]
        public async Task UpdateDocumentAsync_ShouldUpdateDocumentName()
        {
            // Arrange
            var documentId = Guid.NewGuid().ToString();
            var initialName = "Initial Name";
            var updatedName = "Updated Name";
            var document = new Document
            {
                Id = documentId,
                Name = initialName,
                OwnerId = "owner1"
            };
            _context.Documents.Add(document);
            await _context.SaveChangesAsync();

            // Act
            await _repository.UpdateDocumentAsync(documentId, updatedName);

            // Assert
            var updatedDocument = await _context.Documents.FindAsync(documentId);
            Assert.Equal(updatedName, updatedDocument.Name);
        }

        [Fact]
        public async Task DeleteDocumentAsync_ShouldDeleteDocumentAndAssociatedShares()
        {
            // Arrange
            var documentId = Guid.NewGuid().ToString();
            var ownerId = "owner1";
            var document = new Document
            {
                Id = documentId,
                Name = "Document to Delete",
                OwnerId = ownerId
            };

            var shares = new List<DocumentShare>
            {
                new DocumentShare { Id = Guid.NewGuid().ToString(), DocumentId = documentId, UserId = "user1", CanRead = true, CanWrite = false },
                new DocumentShare { Id = Guid.NewGuid().ToString(), DocumentId = documentId, UserId = "user2", CanRead = true, CanWrite = true }
            };

            document.Shares = shares;
            _context.Documents.Add(document);
            await _context.SaveChangesAsync();

            // Act
            await _repository.DeleteDocumentAsync(documentId, ownerId);

            // Assert
            var deletedDocument = await _context.Documents.FindAsync(documentId);
            var remainingShares = await _context.DocumentShares.Where(s => s.DocumentId == documentId).ToListAsync();

            Assert.Null(deletedDocument);
            Assert.Empty(remainingShares);
        }

        [Fact]
        public async Task GetDocumentByIdAsync_ShouldReturnDocument()
        {
            // Arrange
            var documentId = Guid.NewGuid().ToString();
            var document = new Document
            {
                Id = documentId,
                Name = "Test Document",
                OwnerId = "owner1"
            };
            _context.Documents.Add(document);
            await _context.SaveChangesAsync();
            var userId = "owner1";

            // Act
            var result = await _repository.GetDocumentByIdAsync(documentId, userId);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(documentId, result.Id);
        }

        [Fact]
        public async Task GetDocumentsForUserAsync_ShouldReturnOwnedAndSharedDocuments()
        {
            // Arrange
            var userId = "user1";
            var ownedDocument = new Document
            {
                Id = Guid.NewGuid().ToString(),
                Name = "Owned Document",
                OwnerId = userId
            };
            var sharedDocument = new Document
            {
                Id = Guid.NewGuid().ToString(),
                Name = "Shared Document",
                OwnerId = "owner2",
                Shares = new List<DocumentShare>
                {
                    new DocumentShare { Id = Guid.NewGuid().ToString(), UserId = userId, CanRead = true, CanWrite = false }
                }
            };
            _context.Documents.AddRange(ownedDocument, sharedDocument);
            await _context.SaveChangesAsync();

            // Act
            var documents = await _repository.GetDocumentsForUserAsync(userId);

            // Assert
            Assert.Equal(2, documents.Count);
            Assert.Contains(documents, d => d.Name == "Owned Document");
            Assert.Contains(documents, d => d.Name == "Shared Document");
        }

        [Fact]
        public async Task GetUserAccessibleDocumentsAsync_ShouldReturnDocumentsUserHasAccessTo()
        {
            // Arrange
            var userId = "user1";
            var ownedDocument = new Document
            {
                Id = Guid.NewGuid().ToString(),
                Name = "Owned Document",
                OwnerId = userId
            };
            var sharedDocument = new Document
            {
                Id = Guid.NewGuid().ToString(),
                Name = "Shared Document",
                OwnerId = "owner2",
                Shares = new List<DocumentShare>
                {
                    new DocumentShare { Id = Guid.NewGuid().ToString(), UserId = userId, CanRead = true, CanWrite = true }
                }
            };
            var inaccessibleDocument = new Document
            {
                Id = Guid.NewGuid().ToString(),
                Name = "Inaccessible Document",
                OwnerId = "owner3"
            };
            _context.Documents.AddRange(ownedDocument, sharedDocument, inaccessibleDocument);
            await _context.SaveChangesAsync();

            // Act
            var documents = await _repository.GetUserAccessibleDocumentsAsync(userId);

            // Assert
            Assert.Equal(2, documents.Count());
            Assert.Contains(documents, d => d.Name == "Owned Document");
            Assert.Contains(documents, d => d.Name == "Shared Document");
            Assert.DoesNotContain(documents, d => d.Name == "Inaccessible Document");
        }

        [Fact]
        public async Task ShareDocumentAsync_ShouldShareDocumentWithUser()
        {
            // Arrange
            var documentId = Guid.NewGuid().ToString();
            var document = new Document
            {
                Id = documentId,
                Name = "Document to Share",
                OwnerId = "owner1",
                Shares = new List<DocumentShare>()
            };
            _context.Documents.Add(document);

            var existingUser = new User
            {
                UserId = "user1",
                Email = "user1@example.com"
            };
            _context.Users.Add(existingUser);
            await _context.SaveChangesAsync();

            // Act
            var result = await _repository.ShareDocumentAsync(documentId, "user1@example.com", true, "owner1");

            // Assert
            Assert.NotNull(result);
            var share = result.Shares.FirstOrDefault(s => s.UserId == "user1");
            Assert.NotNull(share);
            Assert.True(share.CanWrite);
            Assert.Equal("user1@example.com", share.Email);
        }

        [Fact]
        public async Task ShareDocumentAsync_ShouldCreateAndInviteNewUser_WhenEmailNotFound()
        {
            // Arrange
            var documentId = Guid.NewGuid().ToString();
            var document = new Document
            {
                Id = documentId,
                Name = "Document to Share",
                OwnerId = "owner1",
                Shares = new List<DocumentShare>()
            };
            _context.Documents.Add(document);
            await _context.SaveChangesAsync();

            var newEmail = "newuser@example.com";

            // Act
            var result = await _repository.ShareDocumentAsync(documentId, newEmail, false, "owner1");

            // Assert
            var invitedUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == newEmail);
            Assert.NotNull(invitedUser);
            Assert.True(invitedUser.IsInvited);

            var share = result.Shares.FirstOrDefault(s => s.UserId == invitedUser.UserId);
            Assert.NotNull(share);
            Assert.False(share.CanWrite);
            Assert.Equal(newEmail, share.Email);
        }

        [Fact]
        public async Task UpdateSharePermissions_ShouldUpdatePermissions()
        {
            // Arrange
            var documentId = Guid.NewGuid().ToString();
            var userId = "user1";

            var document = new Document
            {
                Id = documentId,
                Name = "Shared Document",
                OwnerId = "owner1",
                Shares = new List<DocumentShare>
                {
                    new DocumentShare
                    {
                        Id = Guid.NewGuid().ToString(),
                        UserId = userId,
                        CanRead = true,
                        CanWrite = false
                    }
                }
            };
            _context.Documents.Add(document);
            await _context.SaveChangesAsync();

            // Act
            var result = await _repository.UpdateSharePermissions(documentId, userId, canRead: true, canWrite: true);

            // Assert
            var share = result.Shares.FirstOrDefault(s => s.UserId == userId);
            Assert.NotNull(share);
            Assert.True(share.CanRead);
            Assert.True(share.CanWrite);
        }

        [Fact]
        public async Task GetUserCanWritePermissionAsync_ShouldReturnCorrectPermission()
        {
            // Arrange
            var documentId = Guid.NewGuid().ToString();
            var userId = "user1";

            var document = new Document
            {
                Id = documentId,
                Name = "Shared Document",
                OwnerId = "owner1",
                Shares = new List<DocumentShare>
                {
                    new DocumentShare
                    {
                        Id = Guid.NewGuid().ToString(),
                        UserId = userId,
                        CanRead = true,
                        CanWrite = true
                    }
                }
            };
            _context.Documents.Add(document);
            await _context.SaveChangesAsync();

            // Act
            var canWrite = await _repository.GetUserCanWritePermissionAsync(documentId, userId);

            // Assert
            Assert.True(canWrite);
        }

        [Fact]
        public async Task GetUserCanWritePermissionAsync_ShouldThrowException_WhenUserHasNoAccess()
        {
            // Arrange
            var documentId = Guid.NewGuid().ToString();
            var userId = "user1";

            var document = new Document
            {
                Id = documentId,
                Name = "Document",
                OwnerId = "owner1",
                Shares = new List<DocumentShare>()
            };
            _context.Documents.Add(document);
            await _context.SaveChangesAsync();

            // Act & Assert
            await Assert.ThrowsAsync<Exception>(async () =>
            {
                await _repository.GetUserCanWritePermissionAsync(documentId, userId);
            });
        }
    }
}