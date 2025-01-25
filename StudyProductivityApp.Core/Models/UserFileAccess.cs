using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace StudyProductivityApp.Core.Models
{
    public class UserFileAccess
{
    public int UserFileAccessId { get; set; }
    public int UserFileId { get; set; }
    public string SharedWithUserId { get; set; }
    public string SharedByUserId { get; set; } // New property for the sharer
    public UserFile UserFile { get; set; } // Navigation property
    public User SharedWithUser { get; set; } // Navigation property
    public User SharedByUser { get; set; } // New navigation property
    public string SasUri { get; set; }
}


}