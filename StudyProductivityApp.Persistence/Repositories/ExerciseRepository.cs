using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using StudyProductivityApp.Core.Interfaces;
using StudyProductivityApp.Core.Models;
using StudyProductivityApp.Persistence.Data;

namespace StudyProductivityApp.Persistence.Repositories
{
    public class ExerciseRepository : IExerciseRepository
    {
        private readonly StudyProductivityDbContext _context;
        public ExerciseRepository(StudyProductivityDbContext context)
        {
            _context = context;
        }

        // Get all quizzes by a specific user
        public async Task<IEnumerable<Quiz>> GetAllQuizzesByUserIdAsync(string userId)
        {
            return await _context.Quizzes
                                 .Where(q => q.UserId == userId)
                                 .Include(q => q.Questions)
                                 .ThenInclude(q => q.AnswerOptions)
                                 .ToListAsync();
        }

        // Get a quiz by ID (includes UserId validation)
        public async Task<Quiz?> GetQuizByIdAsync(int id, string userId)
        {
            return await _context.Quizzes
                                 .Where(q => q.Id == id && q.UserId == userId)
                                 .Include(q => q.Questions)
                                 .ThenInclude(q => q.AnswerOptions)
                                 .FirstOrDefaultAsync();
        }

        // Add a new quiz
        public async Task AddQuizAsync(Quiz quiz)
        {
            _context.Quizzes.Add(quiz);
            await _context.SaveChangesAsync();
        }

        // Update a quiz (includes UserId validation)
        public async Task UpdateQuizAsync(Quiz quiz)
        {
            _context.Quizzes.Update(quiz);
            await _context.SaveChangesAsync();
        }
        // Delete a quiz (includes UserId validation)
        public async Task DeleteQuizAsync(int id, string userId)
        {
            var quiz = await _context.Quizzes.FirstOrDefaultAsync(q => q.Id == id && q.UserId == userId);
            if (quiz == null) throw new ArgumentException("Quiz not found or user not authorized");

            _context.Quizzes.Remove(quiz);
            await _context.SaveChangesAsync();
        }

        // Submit a quiz
        public async Task<int> SubmitQuizAsync(int id, string userId, List<int> selectedAnswerIds)
        {
            var quiz = await _context.Quizzes
                                     .Where(q => q.Id == id && q.UserId == userId)
                                     .Include(q => q.Questions)
                                     .ThenInclude(q => q.AnswerOptions)
                                     .FirstOrDefaultAsync();

            if (quiz == null) throw new ArgumentException("Quiz not found or user not authorized");

            int correctAnswers = quiz.Questions.Sum(q => q.AnswerOptions.Count(a => a.IsCorrect && selectedAnswerIds.Contains(a.Id)));
            return correctAnswers;
        }

        public async Task<IEnumerable<Concept>> GetAllConceptsAsync(string userId, int? conceptListId = null)
        {
            var query = _context.Concepts.AsQueryable();

            if (!string.IsNullOrWhiteSpace(userId))
            {
                query = query.Where(c => c.UserId == userId);
            }

            if (conceptListId.HasValue)
            {
                query = query.Where(c => c.ConceptListId == conceptListId.Value);
            }

            return await query.ToListAsync();
        }

        public async Task<Concept?> GetConceptByIdAsync(int id, string userId)
        {
            return await _context.Concepts
                .FirstOrDefaultAsync(c => c.Id == id && c.UserId == userId);
        }

        public async Task AddConceptAsync(Concept concept, int conceptListId)
        {
            var conceptList = await _context.ConceptLists.FindAsync(conceptListId);
            if (conceptList == null)
                throw new ArgumentException("Concept list not found.");

            concept.ConceptListId = conceptListId;
            _context.Concepts.Add(concept);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateConceptAsync(Concept concept)
        {
            var existingConcept = await _context.Concepts
                .FirstOrDefaultAsync(c => c.Id == concept.Id && c.UserId == concept.UserId);

            if (existingConcept == null)
                throw new ArgumentException("Concept not found or user not authorized.");

            existingConcept.Title = concept.Title;
            existingConcept.Description = concept.Description;
            existingConcept.ConceptListId = concept.ConceptListId; // Ensure correct list association

            _context.Concepts.Update(existingConcept);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteConceptAsync(int id, string userId)
        {
            var concept = await _context.Concepts
                .FirstOrDefaultAsync(c => c.Id == id && c.UserId == userId);

            if (concept == null)
                throw new ArgumentException("Concept not found or user not authorized.");

            _context.Concepts.Remove(concept);
            await _context.SaveChangesAsync();
        }

        public async Task<IEnumerable<ConceptList>> GetAllConceptListsAsync(string userId)
        {
            return await _context.ConceptLists
                .Include(cl => cl.Concepts)
                .Where(cl => cl.UserId == userId)
                .ToListAsync();
        }

        public async Task<ConceptList?> GetConceptListByIdAsync(int id, string userId)
        {
            return await _context.ConceptLists
                .Include(cl => cl.Concepts)
                .FirstOrDefaultAsync(cl => cl.Id == id && cl.UserId == userId);
        }
        public async Task AddConceptListAsync(ConceptList conceptList)
        {
            _context.ConceptLists.Add(conceptList);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateConceptListAsync(ConceptList conceptList)
        {
            var existingList = await _context.ConceptLists
                .Include(cl => cl.Concepts)
                .FirstOrDefaultAsync(cl => cl.Id == conceptList.Id && cl.UserId == conceptList.UserId);

            if (existingList == null)
                throw new ArgumentException("Concept list not found or user not authorized.");

            existingList.Title = conceptList.Title;

            // Update concepts if needed
            foreach (var concept in conceptList.Concepts)
            {
                var existingConcept = existingList.Concepts.FirstOrDefault(c => c.Id == concept.Id);
                if (existingConcept != null)
                {
                    existingConcept.Title = concept.Title;
                    existingConcept.Description = concept.Description;
                }
                else
                {
                    existingList.Concepts.Add(concept);
                }
            }

            _context.ConceptLists.Update(existingList);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteConceptListAsync(int id, string userId)
        {
            var conceptList = await _context.ConceptLists
                .Include(cl => cl.Concepts)
                .FirstOrDefaultAsync(cl => cl.Id == id && cl.UserId == userId);

            if (conceptList == null)
                throw new ArgumentException("Concept list not found or user not authorized.");

            _context.ConceptLists.Remove(conceptList);
            await _context.SaveChangesAsync();
        }

        public async Task<IEnumerable<SelfTest>> GetAllSelfTestsByUserIdAsync(string userId)
        {
            return await _context.SelfTests
                .Where(st => st.UserId == userId)
                .Include(st => st.SelfTestQuestions)
                .ToListAsync();
        }


        // 2. Get all SelfTestQuestions
        public async Task<IEnumerable<SelfTestQuestion>> GetAllSelfTestQuestionsByUserIdAsync(string userId)
        {
            return await _context.SelfTestQuestions
                .Where(q => q.UserId == userId)
                .ToListAsync();
        }


        // 3. Create a new SelfTest
        public async Task<SelfTest> CreateSelfTestAsync(SelfTest selfTest)
        {
            _context.SelfTests.Add(selfTest);
            await _context.SaveChangesAsync();
            return selfTest;
        }

        // 4. Update an existing SelfTest
        public async Task<SelfTest> UpdateSelfTestAsync(string id, string title)
        {
            var existingSelfTest = await _context.SelfTests
                .Include(st => st.SelfTestQuestions)
                .FirstOrDefaultAsync(st => st.Id.ToString() == id);

            if (existingSelfTest == null)
            {
                throw new KeyNotFoundException("SelfTest not found");
            }

            // Only update the title
            existingSelfTest.Title = title;

            // Use EntityState.Modified to only update the Title property
            _context.Entry(existingSelfTest).Property(x => x.Title).IsModified = true;

            await _context.SaveChangesAsync();
            return existingSelfTest;
        }

        // 5. Delete a SelfTest
        public async Task DeleteSelfTestAsync(Guid selfTestId)
        {
            var selfTest = await _context.SelfTests.FindAsync(selfTestId);
            if (selfTest == null)
            {
                throw new KeyNotFoundException("SelfTest not found");
            }

            _context.SelfTests.Remove(selfTest);
            await _context.SaveChangesAsync();
        }

        public async Task<SelfTestQuestion> CreateSelfTestQuestionAsync(SelfTestQuestion question)
        {
            var selfTest = await _context.SelfTests.FindAsync(question.SelfTestId);
            if (selfTest == null)
            {
                throw new KeyNotFoundException("SelfTest not found");
            }

            _context.SelfTestQuestions.Add(question);
            await _context.SaveChangesAsync();
            return question;
        }

        // Update an existing SelfTestQuestion
        public async Task<SelfTestQuestion> UpdateSelfTestQuestionAsync(SelfTestQuestion question)
        {
            var existingQuestion = await _context.SelfTestQuestions.FindAsync(question.Id);
            if (existingQuestion == null)
            {
                throw new KeyNotFoundException("SelfTestQuestion not found");
            }

            existingQuestion.Text = question.Text;
            existingQuestion.CorrectAnswer = question.CorrectAnswer;
            existingQuestion.SelfTestId = question.SelfTestId;
            existingQuestion.UserId = question.UserId;

            _context.SelfTestQuestions.Update(existingQuestion);
            await _context.SaveChangesAsync();
            return existingQuestion;
        }

        // Delete a SelfTestQuestion
        public async Task DeleteSelfTestQuestionAsync(Guid questionId)
        {
            var question = await _context.SelfTestQuestions.FindAsync(questionId);
            if (question == null)
            {
                throw new KeyNotFoundException("SelfTestQuestion not found");
            }

            _context.SelfTestQuestions.Remove(question);
            await _context.SaveChangesAsync();
        }
    }
}
