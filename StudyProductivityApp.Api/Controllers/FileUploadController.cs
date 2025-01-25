using Microsoft.AspNetCore.Mvc;
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using Azure.Storage.Sas;
using System.Security.Claims;
using StudyProductivityApp.Core.Interfaces.ServiceInterfaces;
using StudyProductivityApp.Core.Models;
using Microsoft.AspNetCore.Authorization;
using System;

namespace StudyProductivityApp.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class FileUploadController : ControllerBase
    {
        private readonly IWebHostEnvironment _env;
        private readonly IConfiguration _configuration;

        // Define the container client at the class level for reuse
        private readonly BlobContainerClient _containerClient;
        private readonly IUserFileService _userFileService;
        private readonly IUserService _userService; // Assuming you have a user service

        public FileUploadController(IWebHostEnvironment env, IConfiguration configuration, IUserFileService userFileService, IUserService userService)
        {
            _userFileService = userFileService;
            _userService = userService;
            _env = env;
            _configuration = configuration;

            // Initialize the BlobContainerClient
            string connectionString = _configuration["StudyProdStorageAcc-ConnectionString"];
            string containerName = _configuration["uploadsContainerName"];

            _containerClient = new BlobContainerClient(connectionString, containerName);
            _containerClient.CreateIfNotExists();
        }

        // Method for general file uploads (Fileshare)
        [HttpPost("upload")]
        [RequestSizeLimit(104857600)] // 100 MB
        public async Task<IActionResult> UploadFile([FromForm] IFormFile file, [FromForm] int? folderId)
        {
            try
            {
                if (file == null || file.Length == 0)
                    return BadRequest("No file uploaded.");

                // Validate file type
                if (!IsFileValid(file))
                    return BadRequest("Invalid file type. Supported types are: .jpg, .jpeg, .png, .gif, .mp4, .mp3, .wav.");

                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (string.IsNullOrEmpty(userId))
                    return Unauthorized("User not authenticated.");

                // Generate a unique file name
                var uniqueFileName = $"{Guid.NewGuid()}_{file.FileName}";

                // For fileshare, files are stored under /uploads
                string blobName = uniqueFileName; // No need to add "uploads/" as the container is "uploads"

                // Get a reference to the blob
                BlobClient blobClient = _containerClient.GetBlobClient(blobName);

                // Set the blob's HTTP headers
                var httpHeaders = new BlobHttpHeaders
                {
                    ContentType = file.ContentType
                };

                // Upload the file to Azure Blob Storage
                using (var stream = file.OpenReadStream())
                {
                    await blobClient.UploadAsync(stream, httpHeaders);
                }

                // Generate SAS URI for the uploaded blob
                var fileSasUri = GetBlobSasUri(blobClient, BlobSasPermissions.Read, DateTimeOffset.UtcNow.AddHours(1));

                string thumbnailSasUri = null;
                if (file.ContentType.StartsWith("video/"))
                {
                    thumbnailSasUri = await GenerateVideoThumbnailAsync(uniqueFileName);
                }
                else if (file.ContentType.StartsWith("audio/"))
                {
                    thumbnailSasUri = await GenerateAudioThumbnailAsync(uniqueFileName);
                }
                else if (file.ContentType.StartsWith("image/"))
                {
                    thumbnailSasUri = fileSasUri;
                }

                // Create UserFile object
                var userFile = new UserFile
                {
                    FileName = file.FileName,
                    FilePath = blobName,
                    FileType = file.ContentType,
                    FileSize = file.Length,
                    UploadedByUserId = userId,
                    UploadDate = DateTime.UtcNow,
                    SasUri = fileSasUri,
                    ThumbnailPath = thumbnailSasUri,
                    FolderId = folderId // Include folder ID if you're organizing files into folders
                };

                await _userFileService.AddFileAsync(userFile);

                return Ok(new
                {
                    fileName = file.FileName,
                    filePath = fileSasUri,
                    fileSize = file.Length,
                    fileType = file.ContentType,
                    uploadDate = DateTime.UtcNow,
                    thumbnailPath = thumbnailSasUri
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error during file upload: {ex.Message}");
                return StatusCode(StatusCodes.Status500InternalServerError,
                    $"An error occurred while uploading the file: {ex.Message}");
            }
        }

        // Method for profile picture uploads
        [HttpPost("uploadProfilePicture")]
        [RequestSizeLimit(10485760)] // 10 MB limit for profile pictures
        public async Task<IActionResult> UploadProfilePicture([FromForm] IFormFile file)
        {
            try
            {
                if (file == null || file.Length == 0)
                    return BadRequest("No file uploaded.");

                // Validate file type (profile pictures should be images)
                if (!IsImageFileValid(file))
                    return BadRequest("Invalid file type. Profile pictures must be images: .jpg, .jpeg, .png, .gif.");

                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (string.IsNullOrEmpty(userId))
                    return Unauthorized("User not authenticated.");

                // Generate a unique file name
                var uniqueFileName = $"{Guid.NewGuid()}_{file.FileName}";

                // Profile pictures are stored under /profiles
                string blobName = $"profiles/{uniqueFileName}";

                // Get a reference to the blob
                BlobClient blobClient = _containerClient.GetBlobClient(blobName);

                // Set the blob's HTTP headers
                var httpHeaders = new BlobHttpHeaders
                {
                    ContentType = file.ContentType
                };

                // Upload the file to Azure Blob Storage
                using (var stream = file.OpenReadStream())
                {
                    await blobClient.UploadAsync(stream, httpHeaders);
                }

                // Generate SAS URI for the uploaded blob
                var fileSasUri = GetBlobSasUri(blobClient, BlobSasPermissions.Read, DateTimeOffset.UtcNow.AddDays(7)); // Longer expiry for profile pictures

                // Update the user's profile image URL
                await _userService.UpdateProfileImageAsync(userId, fileSasUri);

                return Ok(new
                {
                    fileName = file.FileName,
                    filePath = fileSasUri,
                    fileSize = file.Length,
                    fileType = file.ContentType,
                    uploadDate = DateTime.UtcNow
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error during profile picture upload: {ex.Message}");
                return StatusCode(StatusCodes.Status500InternalServerError,
                    $"An error occurred while uploading the profile picture: {ex.Message}");
            }
        }

        // Validation methods
        private static bool IsFileValid(IFormFile file)
        {
            var permittedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif", ".mp4", ".mp3", ".wav" };
            var ext = System.IO.Path.GetExtension(file.FileName).ToLowerInvariant();
            return !string.IsNullOrEmpty(ext) && permittedExtensions.Contains(ext);
        }

        private static bool IsImageFileValid(IFormFile file)
        {
            var permittedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif" };
            var ext = System.IO.Path.GetExtension(file.FileName).ToLowerInvariant();
            return !string.IsNullOrEmpty(ext) && permittedExtensions.Contains(ext);
        }

        private string GetBlobSasUri(BlobClient blobClient, BlobSasPermissions permissions, DateTimeOffset expiresOn)
        {
            // Build the SAS token
            BlobSasBuilder sasBuilder = new BlobSasBuilder
            {
                BlobContainerName = blobClient.BlobContainerName,
                BlobName = blobClient.Name,
                Resource = "b", // b for blob
                StartsOn = DateTimeOffset.UtcNow.AddMinutes(-5), // Start time (backdate to account for clock skew)
                ExpiresOn = expiresOn // Expiry time
            };

            sasBuilder.SetPermissions(permissions);

            // Generate the SAS URI using the storage credentials
            Uri sasUri = blobClient.GenerateSasUri(sasBuilder);

            return sasUri.ToString();
        }

        // Implement thumbnail generation methods as needed

        private async Task<string> GenerateVideoThumbnailAsync(string originalFileName)
        {
            // Logic to generate video thumbnail
            // This is a placeholder; actual implementation depends on your needs
            string thumbnailBlobName = "thumbnails/video.jpg";
            BlobClient thumbnailBlobClient = _containerClient.GetBlobClient(thumbnailBlobName);
            var thumbnailSasUri = GetBlobSasUri(thumbnailBlobClient, BlobSasPermissions.Read, DateTimeOffset.UtcNow.AddHours(1));
            return thumbnailSasUri;
        }

        private async Task<string> GenerateAudioThumbnailAsync(string originalFileName)
        {
            // Logic to generate audio thumbnail
            // This is a placeholder; actual implementation depends on your needs
            string thumbnailBlobName = "thumbnails/audio.jpg";
            BlobClient thumbnailBlobClient = _containerClient.GetBlobClient(thumbnailBlobName);
            var thumbnailSasUri = GetBlobSasUri(thumbnailBlobClient, BlobSasPermissions.Read, DateTimeOffset.UtcNow.AddHours(1));
            return thumbnailSasUri;
        }
    }
}