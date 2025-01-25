using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace StudyProductivityApp.Core.Models
{
    public class SelfTest
    {
        public Guid Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public ICollection<SelfTestQuestion> SelfTestQuestions { get; set; } = new List<SelfTestQuestion>();
        public string UserId { get; set; }
    }
}