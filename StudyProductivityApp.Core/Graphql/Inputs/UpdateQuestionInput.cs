using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace StudyProductivityApp.Core.Graphql.Inputs
{
    public class UpdateQuestionInput
    {
        public int? Id { get; set; }
        public string Text { get; set; }
        public List<UpdateAnswerOptionInput> AnswerOptions { get; set; }
    }
}