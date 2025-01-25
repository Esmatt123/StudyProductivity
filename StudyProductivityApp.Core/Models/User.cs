using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace StudyProductivityApp.Core.Models
{
    public class User
    {
        [Key]
        public string UserId { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public string PasswordHash { get; set; }
        public DateTime CreatedDate { get; set; }
        public string ProfileImageUrl { get; set; }

        // Relationships
        public ICollection<TodoTask> TodoTasks { get; set; } = new List<TodoTask>();
        public ICollection<TodoTaskList> TodoTaskLists { get; set; } = new List<TodoTaskList>();
        public ICollection<UserFile> UploadedFiles { get; set; } = new List<UserFile>();
        public ICollection<UserFileAccess> UserFileAccesses { get; set; } = new List<UserFileAccess>();
       
        public bool IsInvited { get; set; }

        // New properties for profile page functionality
        public ICollection<MeetupEvent> CreatedEvents { get; set; } = new List<MeetupEvent>();
        public ICollection<MeetupEvent> JoinedEvents { get; set; } = new List<MeetupEvent>();

        // Update the Friends relationships
        public ICollection<Friend> Friends { get; set; } = new List<Friend>(); // Users that this user sent friend requests to
        public ICollection<Friend> FriendOf { get; set; } = new List<Friend>(); // Users that sent friend requests to this user
        public ICollection<GroupChatMember> GroupChats { get; set; } // Group chats the user is a part of
    }
}
