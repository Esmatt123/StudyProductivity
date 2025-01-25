using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace StudyProductivityApp.Core.Models
{
    public class ConceptList
    {
        public int Id { get; set; }
        public string Title { get; set; } // Title of the concept list
        public string UserId { get; set; } // Optional: If lists are user-specific
        public ICollection<Concept> Concepts { get; set; } = new List<Concept>();
    }
}