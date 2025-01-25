using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace StudyProductivityApp.Core.Models
{
    public class SelfTestQuestion
    {
        public Guid Id { get; set; }
        public Guid SelfTestId { get; set; }
        public string Text { get; set; } = string.Empty;
        public string CorrectAnswer { get; set; } = string.Empty;
        public SelfTest SelfTest { get; set; }
        public string UserId { get; set; }
    }
}