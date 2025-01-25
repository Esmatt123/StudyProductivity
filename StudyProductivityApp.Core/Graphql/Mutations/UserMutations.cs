using StudyProductivityApp.Core.Graphql.Inputs;
using StudyProductivityApp.Core.Models.Dtos;
using StudyProductivityApp.Core.Interfaces.ServiceInterfaces;
using AutoMapper;

namespace StudyProductivityApp.Core.Graphql.Mutations
{
    public class UserMutations
    {
        private readonly IUserService _userService;
        private readonly IMapper _mapper;

        public UserMutations(IUserService userService, IMapper mapper)
        {
            _userService = userService ?? throw new ArgumentNullException(nameof(userService));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        }


        public async Task<UserDto> RegisterUserAsync(UserRegisterInput input)
        {
            if (input == null)
            {
                throw new ArgumentNullException(nameof(input));
            }

            var registerDto = _mapper.Map<UserRegisterDto>(input);

            // Check for duplicate email
            var existingUser = await _userService.GetUserByEmailAsync(registerDto.Email);
            if (existingUser != null)
            {
                throw new InvalidOperationException("A user with this email already exists.");
            }

            // Proceed to create the user
            return await _userService.CreateUserAsync(registerDto);
        }


        public async Task<LoginResponseDto> LoginUserAsync(UserLoginInput input)
        {
            ArgumentNullException.ThrowIfNull(input);

            var loginDto = _mapper.Map<UserLoginDto>(input);

            // Validate input
            if (string.IsNullOrEmpty(loginDto.Email) || string.IsNullOrEmpty(loginDto.Password))
            {
                throw new ArgumentException("Email and password are required.");
            }

            // Perform login
            var loginResponse = await _userService.LoginAsync(loginDto);

            // Map the UserDto returned from the login process to LoginResponseDto
            var userDto = await _userService.GetUserByEmailAsync(loginDto.Email); // Assuming this fetches UserDto
            var responseDto = _mapper.Map<LoginResponseDto>(userDto);

            // Assign token or other login-specific data
            responseDto.Token = loginResponse.Token;  // Assuming you need to set token or other fields

            return responseDto;
        }

    }
}
