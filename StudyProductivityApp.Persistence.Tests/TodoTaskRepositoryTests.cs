using Microsoft.EntityFrameworkCore;
using StudyProductivityApp.Core.Models;
using StudyProductivityApp.Persistence.Data;
using StudyProductivityApp.Persistence.Repositories;

namespace StudyProductivityApp.Persistence.Tests
{


    public class TodoTaskRepositoryTests
    {
        private StudyProductivityDbContext GetDbContext()
        {
            var options = new DbContextOptionsBuilder<StudyProductivityDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            return new StudyProductivityDbContext(options);
        }

        [Fact]
        public async Task AddTaskAsync_Should_AddTaskToDatabase()
        {
            // Arrange
            var context = GetDbContext();
            var repository = new TodoTaskRepository(context);
            var todoTask = new TodoTask
            {
                TodoTaskListId = 1,
                UserId = "testUser",
                Title = "Test Task"
            };

            // Act
            await repository.AddTaskAsync(todoTask);
            var tasks = await context.TodoTasks.ToListAsync();

            // Assert
            Assert.Single(tasks);
            Assert.Equal("Test Task", tasks[0].Title);
            Assert.Equal(0, tasks[0].Position); // Should be 0 as it's the first task
        }

        [Fact]
        public async Task GetTasksByUserIdAsync_Should_ReturnTasksForUser()
        {
            // Arrange
            var options = new DbContextOptionsBuilder<StudyProductivityDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString()) // Ensure unique DB for test
                .Options;

            await using var context = new StudyProductivityDbContext(options);
            var repository = new TodoTaskRepository(context);

            // Add TodoTaskList data
            context.TodoTaskLists.AddRange(
                new TodoTaskList { TodoTaskListId = 1, UserId = "testUser", Name = "List 1", Position = 0 },
                new TodoTaskList { TodoTaskListId = 2, UserId = "testUser", Name = "List 2", Position = 1 }
            );

            // Add TodoTask data
            context.TodoTasks.AddRange(
                new TodoTask { TodoTaskListId = 1, UserId = "testUser", Title = "Task 1", Position = 0 },
                new TodoTask { TodoTaskListId = 2, UserId = "testUser", Title = "Task 2", Position = 1 },
                new TodoTask { TodoTaskListId = 1, UserId = "otherUser", Title = "Task 3", Position = 2 }
            );
            await context.SaveChangesAsync();

            // Act
            var tasks = await repository.GetTasksByUserIdAsync("testUser");

            // Assert
            Assert.Equal(2, tasks.Count());
            Assert.All(tasks, t => Assert.Equal("testUser", t.UserId));
        }

        [Fact]
        public async Task DeleteTaskAsync_Should_RemoveTaskAndUpdatePositions()
        {
            // Arrange
            var context = GetDbContext();
            var repository = new TodoTaskRepository(context);

            context.TodoTasks.AddRange(
                new TodoTask { TodoTaskId = 1, TodoTaskListId = 1, UserId = "testUser", Title = "Task 1", Position = 0 },
                new TodoTask { TodoTaskId = 2, TodoTaskListId = 1, UserId = "testUser", Title = "Task 2", Position = 1 },
                new TodoTask { TodoTaskId = 3, TodoTaskListId = 1, UserId = "testUser", Title = "Task 3", Position = 2 }
            );
            await context.SaveChangesAsync();

            // Act
            await repository.DeleteTaskAsync(2, "testUser");
            var tasks = await context.TodoTasks.Where(t => t.UserId == "testUser").OrderBy(t => t.Position).ToListAsync();

            // Assert
            Assert.Equal(2, tasks.Count);
            Assert.Equal("Task 1", tasks[0].Title);
            Assert.Equal(0, tasks[0].Position);
            Assert.Equal("Task 3", tasks[1].Title);
            Assert.Equal(1, tasks[1].Position);
        }
        [Fact]
        public async Task MoveTaskAsync_Should_UpdatePositionsInLists()
        {
            // Arrange
            var context = GetDbContext();
            var repository = new TodoTaskRepository(context);

            context.TodoTasks.AddRange(
                new TodoTask { TodoTaskId = 1, TodoTaskListId = 1, UserId = "testUser", Title = "Task 1", Position = 0 },
                new TodoTask { TodoTaskId = 2, TodoTaskListId = 1, UserId = "testUser", Title = "Task 2", Position = 1 },
                new TodoTask { TodoTaskId = 3, TodoTaskListId = 2, UserId = "testUser", Title = "Task 3", Position = 0 }
            );
            await context.SaveChangesAsync();

            // Act
            await repository.MoveTaskAsync(2, 2, 0, "testUser");
            var tasksList1 = await context.TodoTasks.Where(t => t.TodoTaskListId == 1).OrderBy(t => t.Position).ToListAsync();
            var tasksList2 = await context.TodoTasks.Where(t => t.TodoTaskListId == 2).OrderBy(t => t.Position).ToListAsync();

            // Assert
            Assert.Single(tasksList1);
            Assert.Equal("Task 1", tasksList1[0].Title);

            Assert.Equal(2, tasksList2.Count);
            Assert.Equal("Task 2", tasksList2[0].Title);
            Assert.Equal("Task 3", tasksList2[1].Title);
        }
        [Fact]
        public async Task GetTaskByIdAsync_Should_ReturnTask_WhenTaskExists()
        {
            // Arrange
            var context = GetDbContext();
            var repository = new TodoTaskRepository(context);

            context.TodoTasks.Add(new TodoTask { TodoTaskId = 1, TodoTaskListId = 1, UserId = "testUser", Title = "Task 1" });
            await context.SaveChangesAsync();

            // Act
            var task = await repository.GetTaskByIdAsync(1, "testUser");

            // Assert
            Assert.NotNull(task);
            Assert.Equal("Task 1", task.Title);
        }

    }

}