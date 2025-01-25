using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace StudyProductivityApp.Core.Graphql.Inputs
{
    public class UpdateSelfTestQuestionInput
    {
        public string Id { get; set; }
        public string SelfTestId { get; set; }
        public string Text { get; set; }
        public string CorrectAnswer { get; set; }
        public string UserId { get; set; }
    }
}