using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace StudyProductivityApp.Core.Graphql.Inputs
{
    public class AnswerOptionInput
    {
        public string Text { get; set; }
        public bool IsCorrect { get; set; }
    }
}