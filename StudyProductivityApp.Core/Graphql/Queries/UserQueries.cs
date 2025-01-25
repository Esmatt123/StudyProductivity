using StudyProductivityApp.Core.Models.Dtos;
using StudyProductivityApp.Core.Interfaces.ServiceInterfaces;
using AutoMapper;


namespace StudyProductivityApp.Core.Graphql.Queries
{
    public class UserQueries
    {
        private readonly IUserService _userService;
        private readonly IMapper _mapper;

        public UserQueries(IUserService userService, IMapper mapper)
        {
            _mapper = mapper;
            _userService = userService ?? throw new ArgumentNullException(nameof(userService));
        }


        public async Task<UserDto> UserByIdAsync(string userId)
        {
            if (string.IsNullOrEmpty(userId) || !Guid.TryParse(userId, out var guidId))
            {
                throw new ArgumentException("Invalid user ID", nameof(userId));
            }

            var user = await _userService.GetUserByIdAsync(userId); // Ensure this method handles string IDs
            if (user == null)
            {
                throw new KeyNotFoundException("User not found");
            }

            return _mapper.Map<UserDto>(user);
        }


    }


    // Other queries can be added here
}

