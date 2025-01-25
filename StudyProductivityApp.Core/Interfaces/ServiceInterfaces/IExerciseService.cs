using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using StudyProductivityApp.Core.Models;

namespace StudyProductivityApp.Core.Interfaces.ServiceInterfaces
{
    public interface IExerciseService
    {
        Task<IEnumerable<Quiz>> GetAllQuizzesByUserIdAsync(string userId);
        Task<Quiz?> GetQuizByIdAsync(int id, string userId);
        Task AddQuizAsync(Quiz quiz);
        Task UpdateQuizAsync(Quiz quiz);
        Task DeleteQuizAsync(int id, string userId);
        Task<int> SubmitQuizAsync(int id, string userId, List<int> selectedAnswerIds);
        Task<IEnumerable<Concept>> GetAllConceptsAsync(string userId, int? conceptListId = null);
        Task<Concept?> GetConceptByIdAsync(int id, string userId);
        Task AddConceptAsync(Concept concept, int conceptListId);
        Task UpdateConceptAsync(Concept concept);
        Task DeleteConceptAsync(int id, string userId);

        // ConceptList Methods
        Task<IEnumerable<ConceptList>> GetAllConceptListsAsync(string userId);
        Task<ConceptList?> GetConceptListByIdAsync(int id, string userId);
        Task AddConceptListAsync(ConceptList conceptList);
        Task UpdateConceptListAsync(ConceptList conceptList);
        Task DeleteConceptListAsync(int id, string userId);

        Task<IEnumerable<SelfTest>> GetAllSelfTestsByUserIdAsync(string userId);
        Task<IEnumerable<SelfTestQuestion>> GetAllSelfTestQuestionsByUserIdAsync(string userId);
        Task<SelfTest> CreateSelfTestAsync(SelfTest selfTest);
        Task<SelfTest> UpdateSelfTestAsync(string id, string title);
        Task DeleteSelfTestAsync(Guid selfTestId);
        Task<SelfTestQuestion> CreateSelfTestQuestionAsync(SelfTestQuestion question);
        Task<SelfTestQuestion> UpdateSelfTestQuestionAsync(SelfTestQuestion question);
        Task DeleteSelfTestQuestionAsync(Guid questionId);
    }
}