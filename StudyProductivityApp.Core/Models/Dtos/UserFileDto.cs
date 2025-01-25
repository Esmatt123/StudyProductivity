using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace StudyProductivityApp.Core.Models.Dtos
{
    public class UserFileDto
    {
        public string FileName { get; set; }
        public string FilePath { get; set; }
        public string FileType { get; set; }
        public long FileSize { get; set; } // Common field for all files
        public string Resolution { get; set; } // For images/videos
        public double? Duration { get; set; } // For videos/audio
    }

}