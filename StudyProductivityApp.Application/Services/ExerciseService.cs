using StudyProductivityApp.Core.Interfaces;
using StudyProductivityApp.Core.Interfaces.ServiceInterfaces;
using StudyProductivityApp.Core.Models;

namespace StudyProductivityApp.Application.Services
{
    public class ExerciseService : IExerciseService
    {
        private readonly IExerciseRepository _exerciseRepository;

        public ExerciseService(IExerciseRepository exerciseRepository)
        {
            _exerciseRepository = exerciseRepository;
        }
        public async Task AddQuizAsync(Quiz quiz)
        {
            await _exerciseRepository.AddQuizAsync(quiz);
        }

        public async Task DeleteQuizAsync(int id, string userId)
        {
            await _exerciseRepository.DeleteQuizAsync(id, userId);
        }

        public async Task<IEnumerable<Quiz>> GetAllQuizzesByUserIdAsync(string userId)
        {
            return await _exerciseRepository.GetAllQuizzesByUserIdAsync(userId);
        }

        public async Task<Quiz> GetQuizByIdAsync(int id, string userId)
        {
            return await _exerciseRepository.GetQuizByIdAsync(id, userId);
        }

        public async Task<int> SubmitQuizAsync(int id, string userId, List<int> selectedAnswerIds)
        {
            return await _exerciseRepository.SubmitQuizAsync(id, userId, selectedAnswerIds);
        }

        public async Task UpdateQuizAsync(Quiz quiz)
        {
            await _exerciseRepository.UpdateQuizAsync(quiz);
        }

        public async Task<IEnumerable<Concept>> GetAllConceptsAsync(string userId, int? conceptListId = null)
        {
            return await _exerciseRepository.GetAllConceptsAsync(userId, conceptListId);
        }

        public async Task<Concept?> GetConceptByIdAsync(int id, string userId)
        {
            return await _exerciseRepository.GetConceptByIdAsync(id, userId);
        }

        public async Task AddConceptAsync(Concept concept, int conceptListId)
        {
            await _exerciseRepository.AddConceptAsync(concept, conceptListId);
        }

        public async Task UpdateConceptAsync(Concept concept)
        {
            await _exerciseRepository.UpdateConceptAsync(concept);
        }

        public async Task DeleteConceptAsync(int id, string userId)
        {
            await _exerciseRepository.DeleteConceptAsync(id, userId);
        }

        // ConceptList Methods
        public async Task<IEnumerable<ConceptList>> GetAllConceptListsAsync(string userId)
        {
            return await _exerciseRepository.GetAllConceptListsAsync(userId);
        }

        public async Task<ConceptList?> GetConceptListByIdAsync(int id, string userId)
        {
            return await _exerciseRepository.GetConceptListByIdAsync(id, userId);
        }

        public async Task AddConceptListAsync(ConceptList conceptList)
        {
            await _exerciseRepository.AddConceptListAsync(conceptList);
        }

        public async Task UpdateConceptListAsync(ConceptList conceptList)
        {
            await _exerciseRepository.UpdateConceptListAsync(conceptList);
        }

        public async Task DeleteConceptListAsync(int id, string userId)
        {
            await _exerciseRepository.DeleteConceptListAsync(id, userId);
        }

        public async Task<IEnumerable<SelfTest>> GetAllSelfTestsByUserIdAsync(string userId)
        {
            return await _exerciseRepository.GetAllSelfTestsByUserIdAsync(userId);
        }

        public async Task<IEnumerable<SelfTestQuestion>> GetAllSelfTestQuestionsByUserIdAsync(string userId)
        {
            return await _exerciseRepository.GetAllSelfTestQuestionsByUserIdAsync(userId);
        }

        public async Task<SelfTest> CreateSelfTestAsync(SelfTest selfTest)
        {
            return await _exerciseRepository.CreateSelfTestAsync(selfTest);
        }

        public async Task<SelfTest> UpdateSelfTestAsync(string id, string title)
        {
            return await _exerciseRepository.UpdateSelfTestAsync(id, title);
        }

        public async Task DeleteSelfTestAsync(Guid selfTestId)
        {
            await _exerciseRepository.DeleteSelfTestAsync(selfTestId);
        }

        public async Task<SelfTestQuestion> CreateSelfTestQuestionAsync(SelfTestQuestion question)
        {
            return await _exerciseRepository.CreateSelfTestQuestionAsync(question);
        }

        public async Task<SelfTestQuestion> UpdateSelfTestQuestionAsync(SelfTestQuestion question)
        {
            return await _exerciseRepository.UpdateSelfTestQuestionAsync(question);
        }

        public async Task DeleteSelfTestQuestionAsync(Guid questionId)
        {
            await _exerciseRepository.DeleteSelfTestQuestionAsync(questionId);
        }
    }
}