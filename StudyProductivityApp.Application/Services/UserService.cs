using AutoMapper;
using StudyProductivityApp.Core.Models.Dtos;
using StudyProductivityApp.Core.Interfaces.RepositoryInterfaces;
using StudyProductivityApp.Core.Interfaces.ServiceInterfaces;
using StudyProductivityApp.Core.Models;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using System.Text;
using Microsoft.Extensions.Configuration;
using Azure.Storage.Blobs;
using Azure.Storage;
using Azure.Storage.Sas;

namespace StudyProductivityApp.Application.Services
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;
        private readonly IConfiguration _configuration;
        private readonly BlobServiceClient _blobServiceClient;
        private readonly BlobContainerClient _containerClient;
        private readonly StorageSharedKeyCredential _storageCredentials;

        public UserService(IUserRepository userRepository, IMapper mapper, IConfiguration configuration, BlobServiceClient blobServiceClient)
        {
            _userRepository = userRepository ?? throw new ArgumentNullException(nameof(userRepository));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            _configuration = configuration ?? throw new ArgumentNullException(nameof(configuration));
            _blobServiceClient = blobServiceClient ?? throw new ArgumentNullException(nameof(blobServiceClient));

            // Use the correct secret name from Key Vault
            string containerName = _configuration["uploadsContainerName"];
            if (string.IsNullOrEmpty(containerName))
            {
                throw new InvalidOperationException("Container name is not configured in uploadsContainerName");
            }

            try
            {
                _containerClient = _blobServiceClient.GetBlobContainerClient(containerName);
                // Ensure container exists
                _containerClient.CreateIfNotExists();

                // Get storage credentials using the correct secret names
                string accountName = _blobServiceClient.AccountName;
                string accountKey = _configuration["StudyProdStorageAcc-AccountKey"];

                if (string.IsNullOrEmpty(accountName) || string.IsNullOrEmpty(accountKey))
                {
                    throw new InvalidOperationException("Storage account credentials are not properly configured");
                }

                _storageCredentials = new StorageSharedKeyCredential(accountName, accountKey);
            }
            catch (Exception ex)
            {
                throw new InvalidOperationException("Failed to initialize blob storage components", ex);
            }
        }

        public async Task<UserDto> GetUserByIdAsync(string userId)
        {
            // Check if userId is null or empty
            if (string.IsNullOrEmpty(userId))
            {
                throw new ArgumentException("Invalid user ID", nameof(userId));
            }

            // Fetch the user from the repository
            var user = await _userRepository.GetUserByIdAsync(userId);

            // Check if the user is null and handle accordingly
            if (user == null)
            {
                throw new KeyNotFoundException($"User with ID {userId} not found.");
            }

            // Map and return the UserDto
            return _mapper.Map<UserDto>(user);
        }


        public async Task<UserDto> CreateUserAsync(UserRegisterDto registerDto)
        {
            if (registerDto == null)
            {
                throw new ArgumentNullException(nameof(registerDto));
            }

            var user = new User
            {
                UserId = Guid.NewGuid().ToString(),
                Username = registerDto.Username,
                Email = registerDto.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(registerDto.Password),
                CreatedDate = DateTime.UtcNow,
                IsInvited = false,
                ProfileImageUrl = null // Set default profile image if needed
            };

            try
            {
                await _userRepository.AddAsync(user);

                return new UserDto
                {
                    UserId = user.UserId,
                    Username = user.Username,
                    Email = user.Email,
                    CreatedDate = user.CreatedDate,
                    ProfileImageUrl = user.ProfileImageUrl,
                    IsInvited = user.IsInvited
                };
            }
            catch (Exception ex)
            {
                throw new InvalidOperationException("Failed to create user", ex);
            }
        }

        public async Task RefreshProfileImageSasTokens()
        {
            try
            {
                var profiles = await _userRepository.GetAllUserProfilesAsync();

                foreach (var profile in profiles)
                {
                    if (!string.IsNullOrEmpty(profile.ProfileImageUrl))
                    {
                        // Extract the base blob path (everything before any '?')
                        var baseUrl = profile.ProfileImageUrl.Split('?')[0];
                        var blobName = baseUrl.Split("/uploads/")[1];

                        var blobClient = _containerClient.GetBlobClient(blobName);
                        var sasUri = GenerateSasUri(blobClient);
                        profile.ProfileImageUrl = sasUri;
                    }
                }

                await _userRepository.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                // Log the exception
                throw;
            }
        }


        public async Task<LoginResponseDto> LoginAsync(UserLoginDto loginDto)
        {
            if (loginDto == null)
            {
                throw new ArgumentNullException(nameof(loginDto));
            }

            var user = await _userRepository.GetUserByEmailAsync(loginDto.Email);
            if (user == null || !BCrypt.Net.BCrypt.Verify(loginDto.Password, user.PasswordHash))
            {
                throw new UnauthorizedAccessException("Invalid credentials");
            }

            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes(_configuration["jwt-key"]);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(
                [
                    new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()),
                    new Claim(ClaimTypes.Email, user.Email)
                ]),
                Expires = DateTime.UtcNow.AddDays(7),
                Issuer = _configuration["jwt-issuer"],
                Audience = _configuration["jwt-audience"],
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            var tokenString = tokenHandler.WriteToken(token);

            return new LoginResponseDto { Token = tokenString };
        }

        public async Task<UserDto> GetUserByEmailAsync(string email)
        {
            if (string.IsNullOrEmpty(email))
            {
                throw new ArgumentException("Email is required.", nameof(email));
            }

            var user = await _userRepository.GetUserByEmailAsync(email);
            return _mapper.Map<UserDto>(user);
        }

        public async Task<string> UpdateProfileImageAsync(string userId, string blobName)
        {
            try
            {
                var profile = await _userRepository.GetUserProfileAsync(userId);
                if (profile == null)
                {
                    throw new Exception("User profile not found");
                }

                // Store only the blob name or relative path
                profile.ProfileImageUrl = $"profiles/{blobName}";  // Or however you structure your blob paths

                await _userRepository.SaveChangesAsync();

                // Generate and return the full SAS URI
                var blobClient = _containerClient.GetBlobClient(profile.ProfileImageUrl);
                var sasUri = GenerateSasUri(blobClient);

                return sasUri;
            }
            catch (Exception ex)
            {
                // Log the exception if necessary
                throw;
            }
        }

        public async Task<UserProfile> UpdateUserProfileAsync(string userId, string bio, string profilePicUrl)
        {
            return await _userRepository.UpdateUserProfileAsync(userId, bio, profilePicUrl);
        }

        public async Task AddUserProfileAsync(UserProfile userProfile)
        {
            await _userRepository.AddUserProfileAsync(userProfile);
        }

        public async Task<UserProfile> GetUserProfileAsync(string userId)
        {
            var profile = await _userRepository.GetUserProfileAsync(userId);
            if (profile == null)
            {
                return null;
            }

            if (!string.IsNullOrEmpty(profile.ProfileImageUrl))
            {
                // Extract the base blob path (everything before the first '?')
                var baseUrl = profile.ProfileImageUrl.Split('?')[0];

                // Get the blob client using just the blob name (not the full URL)
                var blobName = baseUrl.Split("/uploads/")[1];
                var blobClient = _containerClient.GetBlobClient(blobName);

                // Generate new SAS URI
                var sasUri = GenerateSasUri(blobClient);
                profile.ProfileImageUrl = sasUri;
            }

            return profile;
        }


        public async Task<List<User>> SearchUsersAsync(string searchTerm)
        {
            return await _userRepository.SearchUsersAsync(searchTerm);
        }

        public async Task<List<User>> GetUsersByIdsAsync(List<string> userIds)
        {
            return await _userRepository.GetUsersByIdsAsync(userIds);
        }

        private string GenerateSasUri(BlobClient blobClient)
        {
            var sasBuilder = new BlobSasBuilder
            {
                BlobContainerName = blobClient.BlobContainerName,
                BlobName = blobClient.Name,
                Resource = "b",
                StartsOn = DateTimeOffset.UtcNow.AddMinutes(-5),
                ExpiresOn = DateTimeOffset.UtcNow.AddDays(7)
            };

            sasBuilder.SetPermissions(BlobSasPermissions.Read);

            return blobClient.GenerateSasUri(sasBuilder).ToString();
        }
        public async Task<UserDto> UpdateUserAsync(string userId, string username = null, string email = null)
        {
            var user = await _userRepository.GetUserByIdAsync(userId);
            if (user == null)
            {
                throw new KeyNotFoundException($"User with ID {userId} not found.");
            }

            if (!string.IsNullOrEmpty(username))
            {
                // Check if username is already taken by another user
                var existingUser = await _userRepository.GetUserByUsernameAsync(username);
                if (existingUser != null && existingUser.UserId != userId)
                {
                    throw new InvalidOperationException("Username is already taken.");
                }
                user.Username = username;
            }

            if (!string.IsNullOrEmpty(email))
            {
                // Check if email is already in use by another user
                var existingUser = await _userRepository.GetUserByEmailAsync(email);
                if (existingUser != null && existingUser.UserId != userId)
                {
                    throw new InvalidOperationException("Email is already in use.");
                }
                user.Email = email;
            }

            await _userRepository.UpdateAsync(user);
            return _mapper.Map<UserDto>(user);
        }

        public async Task DeleteUserAsync(string userId)
        {
            var user = await _userRepository.GetUserByIdAsync(userId);
            if (user == null)
            {
                throw new KeyNotFoundException($"User with ID {userId} not found.");
            }

            await _userRepository.DeleteAsync(userId);
        }

        public async Task<List<UserDto>> GetAllUsersAsync()
        {
            var users = await _userRepository.GetAllUsersAsync();
            return _mapper.Map<List<UserDto>>(users);
        }

        public async Task UpdatePasswordAsync(string userId, string currentPassword, string newPassword)
        {
            var user = await _userRepository.GetUserByIdAsync(userId);
            if (user == null)
            {
                throw new KeyNotFoundException($"User with ID {userId} not found.");
            }

            // Verify current password
            if (!BCrypt.Net.BCrypt.Verify(currentPassword, user.PasswordHash))
            {
                throw new UnauthorizedAccessException("Current password is incorrect.");
            }

            // Validate new password (you might want to add more validation rules)
            if (string.IsNullOrEmpty(newPassword) || newPassword.Length < 6)
            {
                throw new ArgumentException("New password must be at least 6 characters long.");
            }

            // Hash new password and update
            string newPasswordHash = BCrypt.Net.BCrypt.HashPassword(newPassword);
            await _userRepository.UpdatePasswordAsync(userId, newPasswordHash);
        }

        public async Task<bool> IsEmailAvailableAsync(string email)
        {
            if (string.IsNullOrEmpty(email))
            {
                throw new ArgumentException("Email cannot be null or empty.", nameof(email));
            }

            return !await _userRepository.ExistsByEmailAsync(email);
        }

        public async Task<bool> IsUsernameAvailableAsync(string username)
        {
            if (string.IsNullOrEmpty(username))
            {
                throw new ArgumentException("Username cannot be null or empty.", nameof(username));
            }

            return !await _userRepository.ExistsByUsernameAsync(username);
        }

        public async Task<UserDto?> GetUserByUsernameAsync(string username)
{
    try
    {
        if (string.IsNullOrEmpty(username))
        {
            return null;
        }

        var user = await _userRepository.GetUserByUsernameAsync(username);
        
        if (user == null)
        {
            return null; // Return null instead of throwing exception
        }

        return new UserDto
        {
            UserId = user.UserId,
            Username = user.Username,
            Email = user.Email,
            CreatedDate = user.CreatedDate,
            ProfileImageUrl = user.ProfileImageUrl,
            IsInvited = user.IsInvited
        };
    }
    catch (Exception ex)
    {
        throw new InvalidOperationException($"Error retrieving user by username: {username}", ex);
    }
}

        public async Task<UserProfile> CreateUserProfileAsync(string userId, string bio = null)
        {
            // Check if user exists
            var user = await _userRepository.GetUserByIdAsync(userId);
            if (user == null)
            {
                throw new KeyNotFoundException($"User with ID {userId} not found.");
            }

            // Check if profile already exists
            var existingProfile = await _userRepository.GetUserProfileAsync(userId);
            if (existingProfile != null)
            {
                throw new InvalidOperationException("User profile already exists.");
            }

            var userProfile = new UserProfile
            {
                UserId = userId,
                Bio = bio,
                User = user
            };

            await _userRepository.AddUserProfileAsync(userProfile);
            return userProfile;
        }

        public async Task<List<UserDto>> SearchUsersAsync(string searchTerm, int? limit = null)
        {
            if (string.IsNullOrEmpty(searchTerm))
            {
                throw new ArgumentException("Search term cannot be null or empty.", nameof(searchTerm));
            }

            // Get users matching the search term
            var users = await _userRepository.SearchUsersAsync(searchTerm);

            // Apply limit if specified
            if (limit.HasValue && limit.Value > 0)
            {
                users = users.Take(limit.Value).ToList();
            }

            // Map to DTOs and return
            return _mapper.Map<List<UserDto>>(users);
        }
    }
}
