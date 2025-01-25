using Microsoft.EntityFrameworkCore;
using StudyProductivityApp.Core.Models;

namespace StudyProductivityApp.Persistence.Data
{
    public class StudyProductivityDbContext : DbContext
    {
        public StudyProductivityDbContext(DbContextOptions<StudyProductivityDbContext> options) : base(options)
        {

        }

        public DbSet<User> Users { get; set; }
        public DbSet<TodoTask> TodoTasks { get; set; } // Add this line
        public DbSet<TodoTaskList> TodoTaskLists { get; set; } // Add this line
        public DbSet<UserProfile> UserProfiles { get; set; }
        public DbSet<Document> Documents { get; set; }
        public DbSet<DocumentShare> DocumentShares { get; set; }
        public DbSet<UserFile> UserFiles { get; set; }
        public DbSet<UserFileAccess> UserFileAccesses { get; set; }
        public DbSet<Folder> Folders { get; set; }
        public DbSet<ChatRoom> ChatRooms { get; set; }
        public DbSet<Message> Messages { get; set; }
        public DbSet<MeetupEvent> MeetupEvents { get; set; }
        public DbSet<Attendee> Attendees { get; set; }
        public DbSet<UserActivity> UserActivities { get; set; }
        public DbSet<Friend> Friends { get; set; }
        public DbSet<GroupChat> GroupChats { get; set; }
        public DbSet<GroupChatMember> GroupChatMembers { get; set; }
        public DbSet<Quiz> Quizzes { get; set; }
        public DbSet<Question> Questions { get; set; }
        public DbSet<AnswerOption> AnswerOptions { get; set; }
        public DbSet<Concept> Concepts { get; set; }
        public DbSet<ConceptList> ConceptLists { get; set; }
        public DbSet<SelfTest> SelfTests { get; set; }
        public DbSet<SelfTestQuestion> SelfTestQuestions { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            // Don't configure anything here since we're using constructor injection
            if (!optionsBuilder.IsConfigured)
            {
                throw new InvalidOperationException("DbContext must be configured through constructor injection");
            }
        }



        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure the relationship between User and Task
            modelBuilder.Entity<TodoTask>()
                .HasOne(t => t.User)
                .WithMany(u => u.TodoTasks)
                .HasForeignKey(t => t.UserId);

            modelBuilder.Entity<UserFile>()
                .HasOne(uf => uf.UploadedByUser)
                .WithMany(u => u.UploadedFiles)
                .HasForeignKey(uf => uf.UploadedByUserId);

            modelBuilder.Entity<UserFileAccess>()
                .HasOne(ufa => ufa.UserFile)
                .WithMany(uf => uf.UserFileAccesses)
                .HasForeignKey(ufa => ufa.UserFileId);

            modelBuilder.Entity<UserFileAccess>()
                .HasOne(ufa => ufa.SharedWithUser)
                .WithMany(u => u.UserFileAccesses)
                .HasForeignKey(ufa => ufa.SharedWithUserId);

            modelBuilder.Entity<UserFile>()
                .HasMany(uf => uf.UserFileAccesses)
                .WithOne(ufa => ufa.UserFile)
                .HasForeignKey(ufa => ufa.UserFileId)
                .OnDelete(DeleteBehavior.Restrict);

            // Configure UserFileAccess - User relationship for shared users
            modelBuilder.Entity<UserFileAccess>()
                .HasOne(ufa => ufa.SharedWithUser)
                .WithMany(u => u.UserFileAccesses)
                .HasForeignKey(ufa => ufa.SharedWithUserId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Attendee>()
                .HasOne(a => a.Event)
                .WithMany(e => e.Attendees)  // An event can have many attendees
                .HasForeignKey(a => a.EventId)
                .OnDelete(DeleteBehavior.Cascade);  // If you delete an event, its attendees are deleted

            modelBuilder.Entity<Attendee>()
                .HasOne(a => a.User)  // Attendees are linked to users
                .WithMany()  // We don’t need to define an inverse collection in User if you don’t need it
                .HasForeignKey(a => a.UserId)
                .OnDelete(DeleteBehavior.Restrict);  // You can decide whether deleting a user affects attendees


            modelBuilder.Entity<User>()
                .HasMany(u => u.CreatedEvents)  // A User can create many MeetupEvents
                .WithOne(me => me.CreatedByUser) // Each MeetupEvent is created by one User
                .HasForeignKey(me => me.CreatedByUserId) // The foreign key property in MeetupEvent
                .OnDelete(DeleteBehavior.Cascade); // Optional: configure delete behavior

            modelBuilder.Entity<Friend>()
                .HasKey(f => f.FriendId); // Set primary key

            modelBuilder.Entity<Friend>()
            .HasOne(f => f.User) // The user who sent the request
            .WithMany(u => u.Friends) // Collection of friends sent by the user
            .HasForeignKey(f => f.UserId)
            .OnDelete(DeleteBehavior.Restrict); // Choose behavior as needed

            modelBuilder.Entity<Friend>()
            .HasOne(f => f.FriendUser) // The user who accepted the request
            .WithMany(u => u.FriendOf) // Collection of friends received by the user
            .HasForeignKey(f => f.FriendUserId)
            .OnDelete(DeleteBehavior.Restrict); // Choose behavior as needed

            modelBuilder.Entity<GroupChatMember>()
           .HasKey(gcm => new { gcm.GroupChatId, gcm.UserId });

            // Configuring one-to-many relationship between GroupChat and GroupChatMember
            modelBuilder.Entity<GroupChatMember>()
                .HasOne(gcm => gcm.GroupChat)
                .WithMany(gc => gc.Members)
                .HasForeignKey(gcm => gcm.GroupChatId);

            // Configuring one-to-many relationship between User and GroupChatMember
            modelBuilder.Entity<GroupChatMember>()
                .HasOne(gcm => gcm.User)
                .WithMany(u => u.GroupChats)
                .HasForeignKey(gcm => gcm.UserId);

            modelBuilder.Entity<Message>()
                .HasOne(m => m.ChatRoom)  // Assuming Message has a ChatRoom navigation property
                .WithMany(cr => cr.Messages)  // Assuming ChatRoom has a Messages collection
                .HasForeignKey(m => m.ChatRoomId)  // Assuming Message has a foreign key property ChatRoomId
                .OnDelete(DeleteBehavior.Cascade);
            modelBuilder.Entity<Folder>()
           .HasOne(f => f.ParentFolder)
           .WithMany(f => f.SubFolders)
           .HasForeignKey(f => f.ParentFolderId)
           .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Folder>()
            .HasMany(f => f.Files)
            .WithOne(uf => uf.Folder) // Specify the navigation property in UserFile
            .HasForeignKey(uf => uf.FolderId) // Specify the foreign key in UserFile
            .IsRequired(false); // Make the foreign key optional (nullable)

            modelBuilder.Entity<FolderAccess>()
       .HasOne(fa => fa.Folder)
       .WithMany(f => f.FolderAccesses)
       .HasForeignKey(fa => fa.FolderId);

            modelBuilder.Entity<FolderAccess>()
                .HasOne(fa => fa.SharedWithUser)
                .WithMany()
                .HasForeignKey(fa => fa.SharedWithUserId);

            modelBuilder.Entity<Quiz>().HasMany(q => q.Questions).WithOne(q => q.Quiz).HasForeignKey(q => q.QuizId);
            modelBuilder.Entity<Question>().HasMany(q => q.AnswerOptions).WithOne(a => a.Question).HasForeignKey(a => a.QuestionId);
            modelBuilder.Entity<Quiz>()
    .Property(q => q.UserId)
    .IsRequired();

            modelBuilder.Entity<ConceptList>()
                   .HasMany(cl => cl.Concepts)
                   .WithOne(c => c.ConceptList)
                   .HasForeignKey(c => c.ConceptListId)
                   .OnDelete(DeleteBehavior.Cascade); // Optional: Configure delete behavior

            modelBuilder.Entity<SelfTest>(entity =>
     {
         entity.HasKey(st => st.Id);
         entity.Property(st => st.Title).IsRequired();
         entity.HasMany(st => st.SelfTestQuestions)
               .WithOne(q => q.SelfTest)
               .HasForeignKey(q => q.SelfTestId);
     });

            // SelfTestQuestion configuration
            modelBuilder.Entity<SelfTestQuestion>(entity =>
            {
                entity.HasKey(q => q.Id);
                entity.Property(q => q.Text).IsRequired();
                entity.Property(q => q.CorrectAnswer).IsRequired();
                entity.HasOne(q => q.SelfTest)
                      .WithMany(st => st.SelfTestQuestions)
                      .HasForeignKey(q => q.SelfTestId);
            });

            modelBuilder.Entity<TodoTask>()
       .HasOne(t => t.TodoTaskList)
       .WithMany(l => l.TodoTasks)
       .HasForeignKey(t => t.TodoTaskListId)
       .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<TodoTaskList>()
                .HasOne(l => l.User)
                .WithMany(u => u.TodoTaskLists)
                .HasForeignKey(l => l.UserId)
                .OnDelete(DeleteBehavior.Cascade);



        }

    }

}