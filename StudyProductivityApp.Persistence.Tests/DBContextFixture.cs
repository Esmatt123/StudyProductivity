using Microsoft.EntityFrameworkCore;
using StudyProductivityApp.Persistence.Data;

namespace StudyProductivityApp.Persistence.Tests
{
    public class DbContextFixture : IDisposable
    {
        public TestStudyProductivityDbContext Context { get; private set; }

        public DbContextFixture()
        {
            // Set up the in-memory database for testing
            var options = new DbContextOptionsBuilder<StudyProductivityDbContext>() // Use StudyProductivityDbContext here
                .UseInMemoryDatabase("TestStudyProductivityDb")
                .Options;

            Context = new TestStudyProductivityDbContext(options); // Pass the correct options

            // Ensure the database is created before running tests
            Context.Database.EnsureCreated();
        }

        public void Dispose()
        {
            // Clean up the in-memory database after the tests
            Context.Database.EnsureDeleted();
            Context.Dispose();
        }
    }
}
