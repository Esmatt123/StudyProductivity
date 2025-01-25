using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace StudyProductivityApp.Core.Graphql.Inputs
{
    public class UserLoginInput
    {
         public string Email { get; set; }
        public string Password { get; set; }
    }
}