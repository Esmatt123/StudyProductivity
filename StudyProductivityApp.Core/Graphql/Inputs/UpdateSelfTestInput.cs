using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace StudyProductivityApp.Core.Graphql.Inputs
{
    public class UpdateSelfTestInput
    {
        public string Id { get; set; }
        public string Title { get; set; }
        public string UserId { get; set; }
    }
}