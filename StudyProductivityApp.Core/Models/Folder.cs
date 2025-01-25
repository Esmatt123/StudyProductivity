using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace StudyProductivityApp.Core.Models
{
    public class Folder
{
    public int FolderId { get; set; }
    public string Name { get; set; }
    public string UserId { get; set; } // To track ownership
    public int? ParentFolderId { get; set; }
    public Folder? ParentFolder { get; set; }
    public ICollection<Folder>? SubFolders { get; set; }
    public ICollection<UserFile>? Files { get; set; }
    public ICollection<FolderAccess> FolderAccesses { get; set; } = new List<FolderAccess>();
}

}