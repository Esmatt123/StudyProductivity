
using AutoMapper;
using StudyProductivityApp.Core.Graphql.Inputs;
using StudyProductivityApp.Core.Models;
using StudyProductivityApp.Core.Models.Dtos;

namespace StudyProductivityApp.Api
{
    public class MapperConfig : Profile
    {
        public MapperConfig()
        {
            CreateMap<UserRegisterDto, User>()
                .ForMember(dest => dest.PasswordHash, opt => opt.MapFrom(src => BCrypt.Net.BCrypt.HashPassword(src.Password)))
                .ForMember(dest => dest.CreatedDate, opt => opt.MapFrom(src => DateTime.Now));

            
            CreateMap<User, UserProfile>()
                .ForMember(dest => dest.UserId, opt => opt.MapFrom(src => src.UserId))  // Map UserId from User to UserProfile
                .ForMember(dest => dest.User, opt => opt.MapFrom(src => src)) // Map the whole User object
                .ForMember(dest => dest.ProfileImageUrl, opt => opt.MapFrom(src => (string)null));  // Set ProfileImageUrl to null

            CreateMap<TodoTaskDto, TodoTask>()
                .ForMember(dest => dest.IsCompleted, opt => opt.MapFrom(src => false)) // Set IsCompleted to false by default
                .ForMember(dest => dest.CreatedDate, opt => opt.MapFrom(src => DateTime.UtcNow)) // Set CreatedDate to current time
                .ForMember(dest => dest.DueDate, opt => opt.MapFrom(src => DateTime.UtcNow.AddDays(7))) // Default due date logic, adjust as needed
                .ForMember(dest => dest.TodoTaskId, opt => opt.Ignore()) // Ignore TodoTaskId, as it's auto-generated
                .ForMember(dest => dest.UserId, opt => opt.Ignore()).ReverseMap(); // Ignore UserId if set elsewhere

            CreateMap<TodoTask, TodoTaskResponseDto>()
            .ForMember(dest => dest.CreatedDateFormatted,
                       opt => opt.MapFrom(src => src.CreatedDate.ToString()))
            .ForMember(dest => dest.DueDateFormatted,
                       opt => opt.MapFrom(src => src.DueDate.ToString()));


            CreateMap<User, UserDto>().ReverseMap();
            CreateMap<UserRegisterDto, UserDto>();
            CreateMap<UserRegisterInput, UserRegisterDto>();
            CreateMap<User, LoginResponseDto>().ReverseMap();

            CreateMap<UserLoginInput, UserLoginDto>();

            CreateMap<UserDto, LoginResponseDto>()
            .ForMember(dest => dest.UserId, opt => opt.MapFrom(src => src.UserId));

            CreateMap<Document, DocumentDto>()
            .ForMember(dest => dest.Shares, opt => opt.MapFrom(src => src.Shares)).ReverseMap(); // Include Shares

            // Mapping between DocumentShare and DocumentShareDto
            CreateMap<DocumentShare, DocumentShareDto>();
            CreateMap<Attendee, AttendeeDto>()
           .ForMember(dest => dest.UserId, opt => opt.MapFrom(src => src.UserId))
           .ForMember(dest => dest.EventId, opt => opt.MapFrom(src => src.EventId))
           .ForMember(dest => dest.User, opt => opt.MapFrom(src => src.User)); // Map the related User

            // Mapping MeetupEvent to MeetupEventDto and including Attendees
            CreateMap<MeetupEvent, MeetupEventDto>()
                .ForMember(dest => dest.Attendees, opt => opt.MapFrom(src => src.Attendees)) // Include Attendees list
                .ForMember(dest => dest.CreatedByUserId, opt => opt.MapFrom(src => src.CreatedByUserId));


            CreateMap<ChatRoom, ChatRoomDto>()
                .ForMember(dest => dest.ChatParticipants,
                           opt => opt.MapFrom(src => src.ChatParticipants))
                .ForMember(dest => dest.Messages,
                           opt => opt.MapFrom(src => src.Messages));

            CreateMap<ChatParticipant, ChatParticipantDto>(); // Ensure this mapping exists
            CreateMap<Message, MessageDto>(); // Ensure this mapping exists


            
        }

    }
}

