
using StudyProductivityApp.Core.Common;
using StudyProductivityApp.Core.Models; // Update with correct namespace

namespace StudyProductivityApp.Core.Interfaces
{
    public interface ITodoTaskRepository
    {
        Task<IEnumerable<TodoTask>> GetTasksByUserIdAsync(string userId);
        Task<IEnumerable<TodoTask>> GetTasksByListIdAsync(int todoTaskListId, string userId);
        Task<TodoTask> GetTaskByIdAsync(int todoTaskId, string userId);
        
        Task AddTaskAsync(TodoTask todoTask);
        Task UpdateTaskAsync(TodoTask todoTask);
        Task DeleteTaskAsync(int todoTaskId, string userId);
        Task<int> GetTotalTasksAsync();

        Task<IEnumerable<TodoTaskList>> GetListsByUserIdAsync(string userId);
        Task AddListAsync(TodoTaskList todoTaskList);
        Task UpdateListAsync(TodoTaskList todoTaskList);
        Task DeleteListAsync(int todoTaskListId, string userId);
        Task<int> GetTotalListsAsync();
        Task MoveTaskAsync(int todoTaskId, int targetListId, int newPosition, string userId);
    }
}