using Microsoft.EntityFrameworkCore;
using StudyProductivityApp.Core.Models;
using StudyProductivityApp.Persistence.Data;

namespace StudyProductivityApp.Persistence.Tests
{
    public class TestStudyProductivityDbContext : StudyProductivityDbContext
    {
        public TestStudyProductivityDbContext(DbContextOptions<StudyProductivityDbContext> options)
            : base(options)
        { }

        // You can add any test-specific overrides here if needed
    }
}
