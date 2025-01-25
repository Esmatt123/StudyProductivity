using Microsoft.EntityFrameworkCore;
using StudyProductivityApp.Core.Common;
using StudyProductivityApp.Core.Interfaces;
using StudyProductivityApp.Core.Models;
using StudyProductivityApp.Persistence.Data;

namespace StudyProductivityApp.Persistence.Repositories
{
    public class TodoTaskRepository : ITodoTaskRepository
    {
        private readonly StudyProductivityDbContext _context;

        public TodoTaskRepository(StudyProductivityDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<TodoTask>> GetTasksByUserIdAsync(string userId)
        {
            var tasks = await _context.TodoTasks
                .Where(t => t.UserId == userId)
                .Include(t => t.TodoTaskList)
                .OrderBy(t => t.TodoTaskList.Position)
                .ThenBy(t => t.Position)
                .ToListAsync();

            return tasks;

        }

        public async Task<IEnumerable<TodoTask>> GetTasksByListIdAsync(int todoTaskListId, string userId)
        {
            var tasks = await _context.TodoTasks
                .Where(t => t.TodoTaskListId == todoTaskListId && t.UserId == userId)
                .OrderBy(t => t.Position)
                .ToListAsync();

            return tasks;
        }

        public async Task AddTaskAsync(TodoTask todoTask)
        {
            // Set the position to the end of the list
            var tasksInList = await _context.TodoTasks
                .Where(t => t.TodoTaskListId == todoTask.TodoTaskListId)
                .CountAsync();

            todoTask.Position = tasksInList; // Position starts at 0

            _context.TodoTasks.Add(todoTask);
            await _context.SaveChangesAsync();

        }

        public async Task UpdateTaskAsync(TodoTask todoTask)
        {
            try
            {
                _context.TodoTasks.Update(todoTask);
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                // Log the exception or return more details for debugging
                Console.Error.WriteLine($"Error occurred: {ex.Message}");
                Console.Error.WriteLine($"Inner Exception: {ex.InnerException?.Message}");
            }
        }


        public async Task DeleteTaskAsync(int todoTaskId, string userId)
        {
            // Fetch the task by Id and UserId
            var todoTask = await _context.TodoTasks
                .FirstOrDefaultAsync(t => t.TodoTaskId == todoTaskId && t.UserId == userId);

            if (todoTask == null)
            {
                throw new Exception("Todo task not found or you do not have permission to delete it.");
            }

            // Remove the task
            _context.TodoTasks.Remove(todoTask);
            await _context.SaveChangesAsync();

            // Update positions of remaining tasks in the list
            var tasksInList = await _context.TodoTasks
                .Where(t => t.TodoTaskListId == todoTask.TodoTaskListId && t.UserId == userId)
                .OrderBy(t => t.Position)
                .ToListAsync();

            for (int i = 0; i < tasksInList.Count; i++)
            {
                tasksInList[i].Position = i;
            }

            _context.TodoTasks.UpdateRange(tasksInList);
            await _context.SaveChangesAsync();
        }


        public async Task<int> GetTotalTasksAsync()
        {
            return await _context.TodoTasks.CountAsync();
        }

        public async Task<IEnumerable<TodoTaskList>> GetListsByUserIdAsync(string userId)
        {
            var lists = await _context.TodoTaskLists
                .Where(l => l.UserId == userId)
                .Include(l => l.TodoTasks)
                .OrderBy(l => l.Position)
                .ToListAsync();

            return lists;
        }



        public async Task AddListAsync(TodoTaskList todoTaskList)
        {

            // Set the position to the end of the user's lists
            var listsCount = await _context.TodoTaskLists
                .Where(l => l.UserId == todoTaskList.UserId)
                .CountAsync();

            todoTaskList.Position = listsCount; // Position starts at 0

            _context.TodoTaskLists.Add(todoTaskList);
            await _context.SaveChangesAsync();


        }

        public async Task UpdateListAsync(TodoTaskList todoTaskList)
        {

            _context.TodoTaskLists.Update(todoTaskList);
            await _context.SaveChangesAsync();


        }

        public async Task DeleteListAsync(int todoTaskListId, string userId)
        {
            // Fetch the list by Id and UserId
            var todoTaskList = await _context.TodoTaskLists
                .FirstOrDefaultAsync(l => l.TodoTaskListId == todoTaskListId && l.UserId == userId);

            if (todoTaskList == null)
            {
                throw new Exception("Todo list not found or you do not have permission to delete it.");
            }

            // Remove associated tasks
            var tasks = _context.TodoTasks.Where(t => t.TodoTaskListId == todoTaskListId);
            _context.TodoTasks.RemoveRange(tasks);

            // Remove the list
            _context.TodoTaskLists.Remove(todoTaskList);
            await _context.SaveChangesAsync();

            // Update positions of remaining lists
            var lists = await _context.TodoTaskLists
                .Where(l => l.UserId == userId)
                .OrderBy(l => l.Position)
                .ToListAsync();

            for (int i = 0; i < lists.Count; i++)
            {
                lists[i].Position = i;
            }

            _context.TodoTaskLists.UpdateRange(lists);
            await _context.SaveChangesAsync();
        }


        public async Task<int> GetTotalListsAsync()
        {
            return await _context.TodoTaskLists.CountAsync();
        }

        public async Task MoveTaskAsync(int todoTaskId, int targetListId, int newPosition, string userId)
        {
            var isTransactionSupported = _context.Database.ProviderName != "Microsoft.EntityFrameworkCore.InMemory";
            using var transaction = isTransactionSupported ? await _context.Database.BeginTransactionAsync() : null;

            var task = await _context.TodoTasks
                .SingleOrDefaultAsync(t => t.TodoTaskId == todoTaskId && t.UserId == userId);

            if (task == null) throw new Exception("Task not found.");

            int originalListId = task.TodoTaskListId;
            int originalPosition = task.Position;

            // Update positions in original list
            var originalListTasks = await _context.TodoTasks
                .Where(t => t.TodoTaskListId == originalListId && t.UserId == userId && t.Position > originalPosition)
                .ToListAsync();

            foreach (var t in originalListTasks)
            {
                t.Position -= 1;
            }

            _context.TodoTasks.UpdateRange(originalListTasks);

            // Update positions in target list
            var targetListTasks = await _context.TodoTasks
                .Where(t => t.TodoTaskListId == targetListId && t.UserId == userId && t.Position >= newPosition)
                .ToListAsync();

            foreach (var t in targetListTasks)
            {
                t.Position += 1;
            }

            _context.TodoTasks.UpdateRange(targetListTasks);

            // Move the task
            task.TodoTaskListId = targetListId;
            task.Position = newPosition;

            _context.TodoTasks.Update(task);

            await _context.SaveChangesAsync();
            if (transaction != null) await transaction.CommitAsync();
        }


        public async Task<TodoTask> GetTaskByIdAsync(int todoTaskId, string userId)
        {
            // Fetch the task from the database where both the task ID and user ID match
            return await _context.TodoTasks
                                   .FirstOrDefaultAsync(t => t.TodoTaskId == todoTaskId && t.UserId == userId);
        }

    }
}
