using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace StudyProductivityApp.Core.Graphql.Inputs
{
    public class QuestionInput
    {
        public string Text { get; set; }
        public List<AnswerOptionInput> AnswerOptions { get; set; }
    }
}