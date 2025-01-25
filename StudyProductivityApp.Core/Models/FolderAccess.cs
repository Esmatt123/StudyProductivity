using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace StudyProductivityApp.Core.Models
{
    public class FolderAccess
{
    public int FolderAccessId { get; set; }
    public int FolderId { get; set; }
    public Folder Folder { get; set; }

    public string SharedWithUserId { get; set; }
    public User SharedWithUser { get; set; }

    public DateTime SharedAt { get; set; }
}

}