using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace StudyProductivityApp.Core.Models.Dtos
{
    public class ComplaintDto
{
    public int ComplaintId { get; set; }
    public string Title { get; set; }
    public string Description { get; set; }
    public DateTime CreatedDate { get; set; }
    public string Status { get; set; }
    // Add other relevant properties
}

}