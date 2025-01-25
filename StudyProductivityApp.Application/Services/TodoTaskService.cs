using StudyProductivityApp.Core.Interfaces;
using StudyProductivityApp.Core.Interfaces.ServiceInterfaces;
using StudyProductivityApp.Core.Models;

namespace StudyProductivityApp.Application.Services
{
    public class TodoTaskService : ITodoTaskService
    {
        private readonly ITodoTaskRepository _todoTaskRepository;
        public TodoTaskService(ITodoTaskRepository todoTaskRepository){
            _todoTaskRepository = todoTaskRepository;

        }
        public async Task AddListAsync(TodoTaskList todoTaskList)
        {
            await _todoTaskRepository.AddListAsync(todoTaskList);
        }

        public async Task AddTaskAsync(TodoTask todoTask)
        {
             await _todoTaskRepository.AddTaskAsync(todoTask);
        }

        public async Task DeleteListAsync(int todoTaskListId, string userId)
        {
             await _todoTaskRepository.DeleteListAsync(todoTaskListId, userId);
        }

        public async Task DeleteTaskAsync(int todoTaskId, string userId)
        {
             await _todoTaskRepository.DeleteTaskAsync(todoTaskId, userId);
        }


        public async Task<IEnumerable<TodoTaskList>> GetListsByUserIdAsync(string userId)
        {
            return await _todoTaskRepository.GetListsByUserIdAsync(userId);
        }

        public async Task<TodoTask> GetTaskByIdAsync(int todoTaskId, string userId)
        {
            return await _todoTaskRepository.GetTaskByIdAsync(todoTaskId, userId);
        }

        public async Task<IEnumerable<TodoTask>> GetTasksByListIdAsync(int todoTaskListId, string userId)
        {
            return await _todoTaskRepository.GetTasksByListIdAsync(todoTaskListId, userId);
        }

        public async Task<IEnumerable<TodoTask>> GetTasksByUserIdAsync(string userId)
        {
            return await _todoTaskRepository.GetTasksByUserIdAsync(userId);
        }

        public async Task<int> GetTotalListsAsync()
        {
            return await _todoTaskRepository.GetTotalListsAsync();
        }

        public async Task<int> GetTotalTasksAsync()
        {
            return await _todoTaskRepository.GetTotalTasksAsync();
        }

        public async Task MoveTaskAsync(int todoTaskId, int targetListId, int newPosition, string userId)
        {
             await _todoTaskRepository.MoveTaskAsync(todoTaskId, targetListId, newPosition, userId);
        }

        public async Task UpdateListAsync(TodoTaskList todoTaskList)
        {
             await _todoTaskRepository.UpdateListAsync(todoTaskList);
        }

        public async Task UpdateTaskAsync(TodoTask todoTask)
        {
             await _todoTaskRepository.UpdateTaskAsync(todoTask);
        }
    }
}