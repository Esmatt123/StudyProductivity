using StudyProductivityApp.Core.Models.Dtos;
using StudyProductivityApp.Core.Graphql.Inputs;
using StudyProductivityApp.Core.Interfaces.RepositoryInterfaces;
using StudyProductivityApp.Core.Models;
using StudyProductivityApp.Core.Interfaces.ServiceInterfaces;
using AutoMapper;
using Microsoft.Extensions.Logging;

namespace StudyProductivityApp.Core.Graphql.Mutations
{
    public class Mutation
    {
        private readonly UserMutations _userMutations;
        private readonly IDocumentRepository _documentRepository; // Inject Document Repository
        private readonly IFriendService _friendService;
        private readonly IUserService _userService;
        private readonly IMeetupService _meetupService;
        private readonly IMapper _mapper;
        private readonly IChatService _chatService;
        private readonly ILogger<Mutation> _logger;
        private readonly IUserFileService _userFileService;
        private readonly IExerciseService _exerciseService;
        private readonly ITodoTaskService _todoTaskService;

        public Mutation(UserMutations userMutations, IDocumentRepository documentRepository, IFriendService friendService, IUserService userService, IMeetupService meetupService, IMapper mapper, IChatService chatService, ILogger<Mutation> logger, IUserFileService userFileService, IExerciseService exerciseService, ITodoTaskService todoTaskService)
        {
            _exerciseService = exerciseService;
            _todoTaskService = todoTaskService;
            _userFileService = userFileService;
            _chatService = chatService;
            _logger = logger;
            _mapper = mapper;
            _meetupService = meetupService;
            _userService = userService;
            _friendService = friendService;
            _userMutations = userMutations;
            _documentRepository = documentRepository; // Initialize Document Repository
        }

        // Existing user mutations
        public Task<LoginResponseDto> LoginUserAsync(UserLoginInput input)
        {
            return _userMutations.LoginUserAsync(input);
        }

        public Task<UserDto> RegisterUserAsync(UserRegisterInput input)
        {
            return _userMutations.RegisterUserAsync(input);
        }

        // New Mutation for updating a document
        public async Task<DocumentDto> UpdateDocumentAsync(DocumentUpdateInput input)
{
    try
    {
        // Fetch the current user ID from the context (e.g., JWT or session)
    

        // Ensure the document exists and belongs to the user
        var document = await _documentRepository.GetDocumentByIdAsync(input.Id, input.userId);
        if (document == null)
        {
            throw new UnauthorizedAccessException("User does not have required permissions to update this document.");
        }

        // Update the document
        await _documentRepository.UpdateDocumentAsync(input.Id, input.Name);

        // Fetch and return the updated document
        var updatedDocument = await _documentRepository.GetDocumentByIdAsync(input.Id, input.userId);

        return new DocumentDto
        {
            Id = updatedDocument.Id,
            Name = updatedDocument.Name
        };
    }
    catch (UnauthorizedAccessException ex)
    {
        throw new GraphQLException("You do not have permission to update this document.");
    }
    catch (Exception ex)
    {
        throw new Exception("An error occurred while updating the document: " + ex.Message);
    }
}



        // New Mutation for deleting a document
        public async Task<bool> DeleteDocumentAsync(string id, string userId)
        {
            try
            {
                // Call the Repository to delete the document with the userId parameter
                await _documentRepository.DeleteDocumentAsync(id, userId);

                // Return true to indicate successful deletion
                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error deleting document: {ex.Message}");
                // Handle or log the error as needed
                return false; // Return false if an error occurred
            }
        }




        public async Task<Document> CreateOrFindDocumentAsync(
        string documentId,
        string documentName,
        string ownerId)
        {
            // Call the updated FindOrCreateDocumentAsync method in the repository
            var document = await _documentRepository.FindOrCreateDocumentAsync(documentId, documentName, ownerId);

            return document;
        }

        public async Task<DocumentDto> ShareDocumentAsync(string DocumentId, string Email, bool CanWrite, string sharedByUserId)
        {
            // Call the repository method to share the document with the user's email and permissions
            var document = await _documentRepository.ShareDocumentAsync(
                DocumentId,     // Document ID
                Email,          // User's email
                CanWrite,       // Write permission
                sharedByUserId
            );

            // Return the shared document details as DocumentDto
            return new DocumentDto
            {
                Id = document.Id,
                Name = document.Name,
                SharedUserId = document.Shares.FirstOrDefault(s => s.Email == Email)?.UserId, // Retrieve the UserId of the shared user
                OwnerId = sharedByUserId,
                CanWrite = CanWrite
            };
        }

        public async Task<Friend> AddFriendAsync(string userId, string friendUserId)
        {
            // Step 1: Add the friendship to the database
            var friend = await _friendService.AddFriendAsync(userId, friendUserId);

            // Step 2: Create a private chat room if the friendship was successfully added
            if (friend != null)
            {
                // Create or retrieve the chat room for the new friendship
                await _chatService.GetOrCreatePrivateChatRoomAsync(userId, friendUserId);
            }

            return friend;
        }




        public async Task<bool> DeleteFriendAsync(string userId, string friendUserId)
        {
            try
            {
                await _friendService.DeleteFriendAsync(userId, friendUserId);

                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error deleting friend: {ex.Message}");
                // Handle or log the error as needed
                return false; // Return false if an error occurred
            }

        }

        public async Task<UserProfileDto> AddUserProfileAsync(string userId, string bio, string profileImageUrl)
        {
            // Create a new UserProfile object
            var userProfile = new UserProfile
            {
                UserId = userId,
                Bio = bio,
                ProfileImageUrl = profileImageUrl
            };

            // Call the service to add the user profile
            await _userService.AddUserProfileAsync(userProfile);

            return new UserProfileDto
            {
                UserId = userId,
                Username = userProfile.User.Username,
                Email = userProfile.User.Email,
                Bio = bio,
                ProfileImageUrl = profileImageUrl
            };
        }


        public async Task<UserProfileDto> UpdateUserProfileAsync(string userId, string bio, string profilePicUrl)
        {
            try
            {
                // Call the service or repository to update the user profile
                var updatedProfile = await _userService.UpdateUserProfileAsync(userId, bio, profilePicUrl);

                // Return the updated profile data as UserProfileDto
                return new UserProfileDto
                {
                    UserId = updatedProfile.UserId,
                    Bio = updatedProfile.Bio,
                    ProfileImageUrl = updatedProfile.ProfileImageUrl
                };
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error updating user profile: {ex.Message}");
                throw;
            }
        }

        public async Task<MeetupEventDto> CreateMeetupAsync(string Title, string Description, string MeetupDate, string LocationName, string Address, string CreatedByUserId, double Latitude, double Longitude)
        {
            // Call the service to create the meetup
            var createdMeetup = await _meetupService.CreateMeetupAsync(Title, Description, MeetupDate, LocationName, Address, CreatedByUserId, Latitude, Longitude);

            // Use AutoMapper to map from MeetupEvent to MeetupEventDto
            return _mapper.Map<MeetupEventDto>(createdMeetup);
        }


        public async Task<bool> DeleteMeetupAsync(string meetupEventId, string userId)
        {
            // Call the repository to delete the meetup
            try
            {
                await _meetupService.DeleteMeetupAsync(meetupEventId, userId);
                return true; // Return true if the deletion was successful
            }
            catch (Exception ex)
            {
                // Log or handle the exception
                throw new GraphQLException($"Failed to delete meetup: {ex.Message}");
            }
        }

        public async Task<string> ToggleAttendanceAsync(string meetupEventId, string userId)
        {
            await _meetupService.ToggleAttendanceAsync(meetupEventId, userId);
            return "Successfully joined the meetup";
        }

        public async Task<bool> UpdateMeetup(MeetupEvent meetup)
        {
            await _meetupService.UpdateMeetupAsync(meetup);
            return true; // Return true if the update was successful
        }
        public async Task<GroupChatDto> GetGroupChatByIdAsync(string groupId)
        {
            if (string.IsNullOrWhiteSpace(groupId))
            {
                _logger.LogWarning("Attempted to retrieve group chat with an invalid groupId.");
                throw new ArgumentException("Group ID must be provided.");
            }

            var groupChat = await _chatService.GetGroupChatByIdAsync(groupId);

            if (groupChat == null)
            {
                _logger.LogWarning("No group chat found for groupId: {GroupId}", groupId);
                throw new KeyNotFoundException("Group chat not found.");
            }

            return MapToGroupChatDto(groupChat);
        }

        public async Task<MessageDto> SaveGroupMessageAsync(string content, string userId, string groupId)
        {
            if (string.IsNullOrWhiteSpace(content) || string.IsNullOrWhiteSpace(userId) || string.IsNullOrWhiteSpace(groupId))
            {
                _logger.LogWarning("Attempted to save a message with invalid parameters.");
                throw new ArgumentException("Message content, user ID, and group ID must be provided.");
            }

            var message = new Message
            {
                Content = content,
                UserId = userId,
                GroupChatId = groupId,
                SentAt = DateTime.UtcNow
            };

            var savedMessage = await _chatService.SaveGroupMessageAsync(groupId, message);
            return MapToMessageDto(savedMessage);
        }

        public async Task<GroupChatDto> CreateGroupChatAsync(CreateGroupChatInput input)
        {
            if (string.IsNullOrWhiteSpace(input.GroupName) || string.IsNullOrWhiteSpace(input.CreatorId) || input.InitialFriendIds == null || !input.InitialFriendIds.Any())
            {
                _logger.LogWarning("Attempted to create a group chat with invalid parameters.");
                throw new ArgumentException("Group name, creator ID, and initial friend IDs must be provided.");
            }

            // Create a list of GroupChatMember instances
            var initialFriendIds = input.InitialFriendIds
                .Select(f => new GroupChatMember
                {
                    UserId = f.UserId, // Assign the user ID

                })
                .ToList();

            var groupChatId = await _chatService.CreateGroupChatAsync(input.GroupName, input.CreatorId, initialFriendIds);
            var groupChat = await _chatService.GetGroupChatByIdAsync(groupChatId);
            return MapToGroupChatDto(groupChat);
        }


        public async Task<bool> DeleteGroupChatAsync(string groupId)
        {
            if (string.IsNullOrWhiteSpace(groupId))
            {
                _logger.LogWarning("Attempted to delete group chat with an invalid groupId.");
                throw new ArgumentException("Group ID must be provided.");
            }

            await _chatService.DeleteGroupChatAsync(groupId);
            return true;
        }

        public async Task<bool> AddFriendToGroupAsync(string groupId, string friendId)
        {
            if (string.IsNullOrWhiteSpace(groupId) || string.IsNullOrWhiteSpace(friendId))
            {
                _logger.LogWarning("Attempted to add friend to group chat with invalid parameters.");
                throw new ArgumentException("Group ID and friend ID must be provided.");
            }

            await _chatService.AddFriendToGroupAsync(groupId, friendId);
            return true;
        }



        public async Task<DocumentDto> UpdateDocumentAsync(string documentId, string documentName, string userId)
        {
            if (string.IsNullOrWhiteSpace(documentId) || string.IsNullOrWhiteSpace(documentName))
            {
                _logger.LogWarning("Attempted to update document with invalid parameters.");
                throw new ArgumentException("Document ID and name must be provided.");
            }

            await _documentRepository.UpdateDocumentAsync(documentId, documentName);
            var updatedDocument = await _documentRepository.GetDocumentByIdAsync(documentId, userId);

            return new DocumentDto
            {
                Id = updatedDocument.Id,
                Name = updatedDocument.Name
            };
        }

        // Private helper methods for DTO mapping
        private GroupChatDto MapToGroupChatDto(GroupChat groupChat)
        {
            // Assuming you have a service to get users by their IDs (like _userService.GetUsersByIdsAsync)
            var userIds = groupChat.Members.Select(m => m.UserId).ToList();
            var users = _userService.GetUsersByIdsAsync(userIds).Result; // Fetch users synchronously for mapping (or await if you prefer async)

            return new GroupChatDto
            {
                Id = groupChat.Id,
                GroupName = groupChat.GroupName,
                CreatorId = groupChat.CreatorId,
                CreatedAt = groupChat.CreatedAt,
                Members = groupChat.Members.Select(member =>
                {
                    var user = users.Find(u => u.UserId == member.UserId); // Find the user by UserId
                    return new GroupChatMember
                    {
                        UserId = member.UserId,
                        Username = user?.Username ?? "Unknown" // Safeguard if user is not found
                    };
                }).ToList(),
                Messages = groupChat.Messages.Select(m => MapToMessageDto(m)).ToList()
            };
        }



        private static MessageDto MapToMessageDto(Message message)
        {
            return new MessageDto
            {
                MessageId = message.MessageId,
                Content = message.Content,
                UserId = message.UserId,
                GroupChatId = message.GroupChatId,
                SentAt = message.SentAt
            };
        }

        [GraphQLName("deleteAllMessages")]
        public async Task<bool> DeleteAllMessagesAsync([GraphQLNonNullType] string chatId, bool isGroupChat)
        {
            if (int.TryParse(chatId, out int chatRoomId))
            {
                await _chatService.DeleteAllMessagesAsync(chatRoomId, isGroupChat);
                return true;
            }
            else
            {
                await _chatService.DeleteAllMessagesAsync(chatId, isGroupChat);
                return true;
            }

        }

        public async Task<bool> KickMembersFromGroupChatAsync(string groupId, string memberId, string requesterId)
        {
            await _chatService.KickMembersFromGroupChatAsync(groupId, memberId, requesterId);
            return true;
        }

        public async Task AddFileAccessAsync(UserFileAccess fileAccess)
        {
            await _userFileService.AddFileAccessAsync(fileAccess);
        }


        [GraphQLName("addFile")]
        public async Task<UserFile> AddFileAsync(
        string fileName,
        string filePath,
        long fileSize,
        string fileType,
        string uploadedByUserId,
        string thumbnailPath,
        int? folderId = null
        )
        {
            // Create a new UserFile instance


            var userFile = new UserFile
            {
                FileName = fileName,
                FilePath = filePath,
                FileSize = fileSize,
                FileType = fileType,
                UploadDate = DateTime.UtcNow, // Set upload date to current UTC time
                UploadedByUserId = uploadedByUserId,
                FolderId = folderId, // Can be null for root-level files
                ThumbnailPath = thumbnailPath
            };

            // Call the service to add the file to the database
            await _userFileService.AddFileAsync(userFile);

            // Return the created UserFile object
            return userFile;
        }



        public async Task<Folder> CreateFolderAsync(string name, string userId, int? parentFolderId)
        {
            var folder = new Folder
            {
                Name = name,
                UserId = userId,
                ParentFolderId = parentFolderId // Can be null
            };

            return await _userFileService.CreateFolderAsync(folder); // FolderId is auto-generated
        }


        public async Task<bool> DeleteFileForUserAsync(int fileId, string userId, bool deleteForEveryone = false)
        {
            await _userFileService.DeleteFileForUserAsync(fileId, userId, deleteForEveryone);
            return true;
        }

        public Task<bool> DeleteFolderAsync(int folderId)
        {
            return _userFileService.DeleteFolderAsync(folderId);
        }



        public async Task RemoveFileAccessAsync(int fileId, string userId)
        {
            await _userFileService.RemoveFileAccessAsync(fileId, userId);
        }

        public Task<bool> RenameFolderAsync(int folderId, string newName)
        {
            return _userFileService.RenameFolderAsync(folderId, newName);
        }

        public async Task UpdateFileAsync(UserFile file)
        {
            await _userFileService.UpdateFileAsync(file);
        }
        public async Task<UserFileAccess> ShareFileAccessAsync(int userFileId, string sharedWithUserId, string sharedByUserId)
        {
            return await _userFileService.ShareFileAccessAsync(userFileId, sharedWithUserId, sharedByUserId);
        }

        // Method to revoke file access
        public async Task<bool> RevokeFileAccessAsync(int userFileId, string sharedWithUserId)
        {
            return await _userFileService.RevokeFileAccessAsync(userFileId, sharedWithUserId);
        }


        public async Task<Quiz> AddQuiz(string title, string userId, List<QuestionInput> questions)
        {
            var quiz = new Quiz
            {
                Title = title,
                UserId = userId,
                Questions = questions.Select(q => new Question
                {
                    Text = q.Text,
                    AnswerOptions = q.AnswerOptions.Select(a => new AnswerOption
                    {
                        Text = a.Text,
                        IsCorrect = a.IsCorrect
                    }).ToList()
                }).ToList()
            };

            await _exerciseService.AddQuizAsync(quiz);
            return quiz;
        }


        public async Task<bool> DeleteQuizAsync(int id, string userId)
        {
            await _exerciseService.DeleteQuizAsync(id, userId);
            return true;
        }



        public async Task<int> SubmitQuizAsync(int id, string userId, List<int> selectedAnswerIds)
        {
            return await _exerciseService.SubmitQuizAsync(id, userId, selectedAnswerIds);
        }

        public async Task<Quiz> UpdateQuizAsync(int id, string title, string userId, List<UpdateQuestionInput> questions)
        {
            var existingQuiz = await _exerciseService.GetQuizByIdAsync(id, userId);

            if (existingQuiz == null)
                throw new ArgumentException("Quiz not found or user not authorized.");

            existingQuiz.Title = title;

            // Remove questions that are no longer in the updated quiz
            foreach (var existingQuestion in existingQuiz.Questions.ToList())
            {
                if (!questions.Any(q => q.Id == existingQuestion.Id))
                {
                    existingQuiz.Questions.Remove(existingQuestion);
                }
            }

            // Update existing questions and add new ones
            foreach (var updatedQuestion in questions)
            {
                if (updatedQuestion.Id.HasValue)
                {
                    var existingQuestion = existingQuiz.Questions.FirstOrDefault(q => q.Id == updatedQuestion.Id.Value);
                    if (existingQuestion != null)
                    {
                        existingQuestion.Text = updatedQuestion.Text;

                        // Remove answer options that are no longer in the updated question
                        foreach (var existingOption in existingQuestion.AnswerOptions.ToList())
                        {
                            if (!updatedQuestion.AnswerOptions.Any(ao => ao.Id == existingOption.Id))
                            {
                                existingQuestion.AnswerOptions.Remove(existingOption);
                            }
                        }

                        // Update existing answer options and add new ones
                        foreach (var updatedOption in updatedQuestion.AnswerOptions)
                        {
                            if (updatedOption.Id.HasValue)
                            {
                                var existingOption = existingQuestion.AnswerOptions.FirstOrDefault(ao => ao.Id == updatedOption.Id.Value);
                                if (existingOption != null)
                                {
                                    existingOption.Text = updatedOption.Text;
                                    existingOption.IsCorrect = updatedOption.IsCorrect;
                                }
                            }
                            else
                            {
                                existingQuestion.AnswerOptions.Add(new AnswerOption
                                {
                                    Text = updatedOption.Text,
                                    IsCorrect = updatedOption.IsCorrect
                                });
                            }
                        }
                    }
                }
                else
                {
                    var newQuestion = new Question
                    {
                        Text = updatedQuestion.Text,
                        QuizId = existingQuiz.Id,
                        AnswerOptions = updatedQuestion.AnswerOptions.Select(ao => new AnswerOption
                        {
                            Text = ao.Text,
                            IsCorrect = ao.IsCorrect
                        }).ToList()
                    };
                    existingQuiz.Questions.Add(newQuestion);
                }
            }

            await _exerciseService.UpdateQuizAsync(existingQuiz);
            return existingQuiz;
        }

        public async Task<Concept> AddConcept(ConceptInput conceptInput)
        {
            var concept = new Concept
            {
                Title = conceptInput.Title,
                Description = conceptInput.Description,
                UserId = conceptInput.UserId,
                ConceptListId = conceptInput.ConceptListId
            };

            await _exerciseService.AddConceptAsync(concept, conceptInput.ConceptListId);
            return concept;
        }

        public async Task<Concept> UpdateConcept(UpdateConceptInput conceptInput)
        {
            var concept = new Concept
            {
                Id = conceptInput.Id,
                Title = conceptInput.Title,
                Description = conceptInput.Description,
                UserId = conceptInput.UserId,
                ConceptListId = conceptInput.ConceptListId
            };

            await _exerciseService.UpdateConceptAsync(concept);
            return concept;
        }

        public async Task<bool> DeleteConcept(int id, string userId)
        {
            await _exerciseService.DeleteConceptAsync(id, userId);
            return true;
        }

        public async Task<ConceptList> AddConceptList(ConceptListInput conceptListInput)
        {
            var conceptList = new ConceptList
            {
                Title = conceptListInput.Title,
                UserId = conceptListInput.UserId
            };

            await _exerciseService.AddConceptListAsync(conceptList);
            return conceptList;
        }

        public async Task<ConceptList> UpdateConceptList(UpdateConceptListInput conceptListInput)
        {
            var conceptList = new ConceptList
            {
                Id = conceptListInput.Id,
                Title = conceptListInput.Title,
                UserId = conceptListInput.UserId
            };

            await _exerciseService.UpdateConceptListAsync(conceptList);
            return conceptList;
        }

        public async Task<bool> DeleteConceptList(int id, string userId)
        {
            await _exerciseService.DeleteConceptListAsync(id, userId);
            return true;
        }

        public async Task<SelfTest> CreateSelfTestAsync(CreateSelfTestInput input)
        {
            var selfTest = new SelfTest
            {
                Id = Guid.NewGuid(),
                Title = input.Title,
                UserId = input.UserId
            };

            return await _exerciseService.CreateSelfTestAsync(selfTest);
        }

        public async Task<SelfTest> UpdateSelfTestAsync(string id, string title)
        {
            if (!Guid.TryParse(id, out var guidId))
                throw new ArgumentException("Invalid GUID format", nameof(id));

            

            return await _exerciseService.UpdateSelfTestAsync(id, title);
        }


        public async Task<bool> DeleteSelfTestAsync(string selfTestId)
        {
            if (!Guid.TryParse(selfTestId, out var guidSelfTestId))
                throw new ArgumentException("Invalid GUID format", nameof(selfTestId));

            await _exerciseService.DeleteSelfTestAsync(guidSelfTestId);
            return true;
        }

        public async Task<SelfTestQuestion> CreateSelfTestQuestionAsync(string selfTestId, string text, string correctAnswer, string userId)
        {
            if (!Guid.TryParse(selfTestId, out var guidSelfTestId))
                throw new ArgumentException("Invalid GUID format", nameof(selfTestId));

            var question = new SelfTestQuestion
            {
                Id = Guid.NewGuid(),
                SelfTestId = guidSelfTestId,
                Text = text,
                CorrectAnswer = correctAnswer,
                UserId = userId
            };

            return await _exerciseService.CreateSelfTestQuestionAsync(question);
        }


        public async Task<SelfTestQuestion> UpdateSelfTestQuestionAsync(string id, string selfTestId, string text, string correctAnswer, string userId)
        {
            if (!Guid.TryParse(id, out var guidId) || !Guid.TryParse(selfTestId, out var guidSelfTestId))
                throw new ArgumentException("Invalid GUID format");

            var question = new SelfTestQuestion
            {
                Id = guidId,
                SelfTestId = guidSelfTestId,
                Text = text,
                CorrectAnswer = correctAnswer,
                UserId = userId
            };

            return await _exerciseService.UpdateSelfTestQuestionAsync(question);
        }


        public async Task<bool> DeleteSelfTestQuestionAsync(string questionId)
        {
            if (!Guid.TryParse(questionId, out var guidSelfTestId))
                throw new ArgumentException("Invalid GUID format", nameof(questionId));
            await _exerciseService.DeleteSelfTestQuestionAsync(guidSelfTestId);
            return true;
        }

        public async Task<TodoTaskList> AddListAsync(AddTodoTaskListInput input)
        {
            var todoTaskList = new TodoTaskList
            {
                Name = input.Name,
                Position = input.Position,
                UserId = input.UserId
            };

            await _todoTaskService.AddListAsync(todoTaskList);
            return todoTaskList;
        }


        public async Task<TodoTask> AddTaskAsync(AddTodoTaskInput input)
        {
            var todoTask = new TodoTask
            {
                Title = input.Title,
                Description = input.Description,
                DueDate = input.DueDate,
                Position = input.Position,
                TodoTaskListId = input.TodoTaskListId,
                UserId = input.UserId
            };

            await _todoTaskService.AddTaskAsync(todoTask);
            return todoTask;
        }


        public async Task<bool> DeleteListAsync(int todoTaskListId, string userId)
        {
            await _todoTaskService.DeleteListAsync(todoTaskListId, userId);
            return true;
        }

        public async Task<bool> DeleteTaskAsync(int todoTaskId, string userId)
        {
            await _todoTaskService.DeleteTaskAsync(todoTaskId, userId);
            return true;
        }


        public async Task<bool> MoveTaskAsync(int todoTaskId, int targetListId, int newPosition, string userId)
        {
            // Ensure the task exists before attempting to move it
            var todoTask = await _todoTaskService.GetTaskByIdAsync(todoTaskId, userId);
            if (todoTask == null)
            {
                throw new Exception("Task not found or doesn't belong to the user.");
            }

            // Ensure the target list exists
            var targetList = await _todoTaskService.GetListsByUserIdAsync(userId);
            if (targetList == null)
            {
                throw new Exception("Target list not found or doesn't belong to the user.");
            }

            // Perform the task movement logic
            todoTask.TodoTaskListId = targetListId;
            todoTask.Position = newPosition;

            // Call the service to update the task
            await _todoTaskService.UpdateTaskAsync(todoTask);

            var success = true;

            if (!success)
            {
                return false; // Return false if the task could not be updated
            }

            return success; // Return true if the task was successfully moved
        }


        public async Task<TodoTaskList> UpdateListAsync(UpdateTodoTaskListInput input)
        {
            var todoTaskList = new TodoTaskList
            {
                TodoTaskListId = input.TodoTaskListId,
                Name = input.Name,
                Position = input.Position,
                UserId = input.UserId
            };

            await _todoTaskService.UpdateListAsync(todoTaskList);
            return todoTaskList;
        }


        public async Task<TodoTask> UpdateTaskAsync(UpdateTodoTaskInput input)
        {
            var todoTask = new TodoTask
            {
                TodoTaskId = input.TodoTaskId,
                Title = input.Title,
                Description = input.Description,
                IsCompleted = input.IsCompleted,
                DueDate = input.DueDate,
                Position = input.Position,
                TodoTaskListId = input.TodoTaskListId,
                UserId = input.UserId
            };

            await _todoTaskService.UpdateTaskAsync(todoTask);
            return todoTask;
        }




    }
}
