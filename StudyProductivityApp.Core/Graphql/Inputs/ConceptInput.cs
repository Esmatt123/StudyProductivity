using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace StudyProductivityApp.Core.Graphql.Inputs
{
    public class ConceptInput
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public string UserId { get; set; }
        public int ConceptListId { get; set; }
    }
}

