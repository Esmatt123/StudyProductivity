using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace StudyProductivityApp.Core.Models
{
    public class Concept
    {
        public int Id { get; set; }
        public string Title { get; set; } // The name of the concept
        public string Description { get; set; } // Explanation of the concept
        public string UserId { get; set; } // Optional: If concepts are user-specific
        public int ConceptListId { get; set; } // Foreign key to ConceptList
        public ConceptList ConceptList { get; set; } // Navigation property
    }
}