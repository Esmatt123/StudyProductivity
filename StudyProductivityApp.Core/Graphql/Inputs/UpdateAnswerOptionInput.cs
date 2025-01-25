using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace StudyProductivityApp.Core.Graphql.Inputs
{
    public class UpdateAnswerOptionInput
    {
        public int? Id { get; set; }
        public string Text { get; set; }
        public bool IsCorrect { get; set; }
    }
}