using StudyProductivityApp.Core.Models.Dtos;
using StudyProductivityApp.Core.Models;
using StudyProductivityApp.Core.Interfaces.RepositoryInterfaces;
using AutoMapper;
using StudyProductivityApp.Core.Interfaces.ServiceInterfaces;

namespace StudyProductivityApp.Core.Graphql.Queries
{
    public class Query
    {
        private readonly UserQueries _userQueries;
        private readonly IDocumentRepository _documentRepository;
        private readonly IMapper _mapper;
        private readonly IFriendService _friendService;
        private readonly IUserService _userService;
        private readonly IMeetupService _meetupService;
        private readonly IChatService _chatService;
        private readonly IUserFileService _userFileService;
        private readonly IExerciseService _exerciseService;
        private readonly ITodoTaskService _todoTaskService;

        public Query(UserQueries userQueries, IDocumentRepository documentRepository, IMapper mapper, IFriendService friendService, IUserService userService, IMeetupService meetupService, IChatService chatService, IUserFileService userFileService, IExerciseService exerciseService, ITodoTaskService todoTaskService)
        {
            _exerciseService = exerciseService;
            _todoTaskService = todoTaskService;
            _userFileService = userFileService;
            _chatService = chatService;
            _meetupService = meetupService;
            _userService = userService;
            _mapper = mapper;
            _friendService = friendService;
            _documentRepository = documentRepository;
            _userQueries = userQueries;
        }


        public Task<UserDto> GetUserById(string userId) => _userQueries.UserByIdAsync(userId);

        public async Task<List<Document>> GetDocuments()
        {
            return await _documentRepository.GetAllDocumentsAsync();
        }



        public async Task<IEnumerable<DocumentDto>> GetAccessibleDocumentsAsync(string userId)
        {
            var documents = await _documentRepository.GetUserAccessibleDocumentsAsync(userId);

            // Use AutoMapper to map the list of documents to DocumentDto
            return _mapper.Map<IEnumerable<DocumentDto>>(documents);
        }

        public async Task<bool> GetCanWritePermission(string documentId, string userId)
        {
            // Call the method to retrieve the user's canWrite permission
            var document = await _documentRepository.GetDocumentByIdAsync(documentId, userId);
            if (document == null) return false;

            // Check if the user is the owner
            if (document.OwnerId == userId)
            {
                return true; // Owner has write permissions
            }

            // Check other permission logic here...
            return await _documentRepository.GetUserCanWritePermissionAsync(documentId, userId);
        }

        public async Task<List<Friend>> GetFriendsAsync(string userId)
        {
            return await _friendService.GetFriendsAsync(userId);
        }

        public async Task<UserProfile> GetUserProfileAsync(string userId)
        {
            return await _userService.GetUserProfileAsync(userId);
        }

        public async Task<IEnumerable<MeetupEventDto>> GetAllMeetupsAsync(string userId)
        {
            try
            {
                // Call the service to get all meetups for the user and their friends
                var meetups = await _meetupService.GetAllMeetupsAsync(userId);

                // Use AutoMapper to map the result to a list of MeetupEventDto
                return _mapper.Map<IEnumerable<MeetupEventDto>>(meetups);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error fetching meetups: {ex.Message}");
                throw;
            }
        }

        public async Task<List<User>> SearchUsers(string searchTerm)
        {
            return await _userService.SearchUsersAsync(searchTerm);
        }

        public async Task<IEnumerable<GroupChat>> GetUserGroupChatsAsync(string userId)
        {
            return await _chatService.GetUserGroupChatsAsync(userId);
        }

        public async Task<IEnumerable<ChatRoomDto>> GetChatRoomsByUserIds(string userId1, string userId2)
        {
            var chatRooms = await _chatService.GetUserChatRoomsAsync(userId1, userId2);
            return _mapper.Map<List<ChatRoomDto>>(chatRooms);
        }


        [GraphQLName("isGroupChat")]
        public async Task<bool> GetIsGroupChatAsync([GraphQLNonNullType] string chatId)
        {
            // Logic to determine whether chatId is int or string (convert if necessary)
            if (int.TryParse(chatId, out int chatRoomId))
            {
                return await _chatService.GetIsGroupChatAsync(chatRoomId);
            }
            else
            {
                return await _chatService.GetIsGroupChatAsync(chatId);
            }
        }
        [GraphQLName("messages")]
        public async Task<List<Message>> GetMessagesAsync([GraphQLNonNullType] string chatId, int offset, int limit)
        {
            // Check if chatId can be parsed as an integer
            if (int.TryParse(chatId, out int chatRoomId))
            {
                // Treat as private chat using integer ID
                return await _chatService.FetchMessagesAsync(chatRoomId, isGroupChat: false, offset: offset, limit: limit);
            }
            else
            {
                // Treat as group chat using string ID
                return await _chatService.FetchMessagesAsync(chatId, isGroupChat: true, offset: offset, limit: limit);
            }
        }

        public async Task<IEnumerable<UserFileAccess>> GetFileAccessesAsync(int fileId)
        {
            return await _userFileService.GetFileAccessesAsync(fileId);
        }
        [GraphQLName("getFilesByParentFolderId")]
        public async Task<IEnumerable<UserFile>> GetFilesByParentFolderIdAsync(int parentFolderId, string userId)
        {
            return await _userFileService.GetFilesByParentFolderIdAsync(parentFolderId, userId);
        }
        [GraphQLName("getFoldersByParentFolderId")]
        public async Task<IEnumerable<Folder>> GetFoldersByParentFolderIdAsync(int parentFolderId, string userId)
        {
            return await _userFileService.GetFoldersByParentFolderIdAsync(parentFolderId, userId);
        }
        [GraphQLName("getRootFilesByUserId")]
        public async Task<IEnumerable<UserFile>> GetRootFilesByUserIdAsync(string userId)
        {
            return await _userFileService.GetRootFilesByUserIdAsync(userId);
        }

        [GraphQLName("getRootFoldersByUserId")]
        public async Task<IEnumerable<Folder>> GetRootFoldersByUserIdAsync(string userId)
        {
            return await _userFileService.GetRootFoldersByUserIdAsync(userId);
        }
        [GraphQLName("getFileByUserId")]
        public async Task<UserFile> GetFileByUserIdAsync(int fileId, string userId)
        {
            return await _userFileService.GetFileByUserIdAsync(fileId, userId);
        }
        [GraphQLName("getFileAccessByUser")]
        public async Task<List<UserFileAccess>> GetFileAccessByUserAsync(string userId)
        {
            return await _userFileService.GetFileAccessByUserAsync(userId);
        }
        [GraphQLName("getAllQuizzesByUserId")]
        public async Task<IEnumerable<Quiz>> GetAllQuizzesByUserIdAsync(string userId)
        {
            return await _exerciseService.GetAllQuizzesByUserIdAsync(userId);
        }
        [GraphQLName("getQuizById")]
        public async Task<Quiz> GetQuizByIdAsync(int id, string userId)
        {
            return await _exerciseService.GetQuizByIdAsync(id, userId);
        }
        [GraphQLName("getAllConcepts")]
        public Task<IEnumerable<Concept>> GetAllConceptsAsync(string userId, int? conceptListId = null)
        {
            return _exerciseService.GetAllConceptsAsync(userId, conceptListId);
        }



        [GraphQLName("getAllConceptLists")]
        public Task<IEnumerable<ConceptList>> GetAllConceptListsAsync(string userId)
        {
            return _exerciseService.GetAllConceptListsAsync(userId);
        }

        [GraphQLName("getAllSelfTestsByUserId")]
        public async Task<IEnumerable<SelfTest>> GetAllSelfTestsByUserIdAsync(string userId)
        {
            return await _exerciseService.GetAllSelfTestsByUserIdAsync(userId);
        }

        [GraphQLName("getAllSelfTestQuestionsByUserId")]
        public async Task<IEnumerable<SelfTestQuestion>> GetAllSelfTestQuestionsByUserIdAsync(string userId)
        {
            return await _exerciseService.GetAllSelfTestQuestionsByUserIdAsync(userId);
        }




        [GraphQLName("getTotalLists")]
        public async Task<int> GetTotalListsAsync()
        {
            return await _todoTaskService.GetTotalListsAsync();
        }
        [GraphQLName("getTotalTasks")]
        public async Task<int> GetTotalTasksAsync()
        {
            return await _todoTaskService.GetTotalTasksAsync();
        }

        [GraphQLName("getListsByUserId")]
        public async Task<IEnumerable<TodoTaskList>> GetListsByUserIdAsync(string userId)
        {
            return await _todoTaskService.GetListsByUserIdAsync(userId);
        }

        [GraphQLName("getTasksByListId")]
        public async Task<IEnumerable<TodoTask>> GetTasksByListIdAsync(int todoTaskListId, string userId)
        {
            return await _todoTaskService.GetTasksByListIdAsync(todoTaskListId, userId);
        }
        [GraphQLName("getTasksByUserId")]
        public async Task<IEnumerable<TodoTask>> GetTasksByUserIdAsync(string userId)
        {
            return await _todoTaskService.GetTasksByUserIdAsync(userId);
        }

        [GraphQLName("documentPermissions")]
        public async Task<Document> GetDocumentPermissionsAsync(
        string documentId, string userId)
        {
            if (string.IsNullOrEmpty(userId))
                throw new UnauthorizedAccessException("User not authenticated");

            var document = await _documentRepository.GetDocumentByIdAsync(documentId, userId);
            if (document == null)
                throw new Exception("Document not found");

            return document;
        }



    }
}
