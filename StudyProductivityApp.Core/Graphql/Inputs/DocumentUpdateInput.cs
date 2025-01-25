using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace StudyProductivityApp.Core.Graphql.Inputs
{
    public class DocumentUpdateInput
    {
        public string Id { get; set; } // ID of the document to be updated
        public string Name { get; set; } // New data for the document
        public string userId { get; set; } 
    }
}