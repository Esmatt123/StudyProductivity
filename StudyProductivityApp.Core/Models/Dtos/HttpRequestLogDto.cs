using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace StudyProductivityApp.Core.Models.Dtos
{
    public class HttpRequestLogDto
    {
        public string Url { get; set; }
        public string HttpMethod { get; set; }
        public DateTime RequestTime { get; set; }
        public int StatusCode { get; set; }
    }
}