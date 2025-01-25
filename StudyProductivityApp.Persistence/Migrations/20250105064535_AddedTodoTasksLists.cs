using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace StudyProductivityApp.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddedTodoTasksLists : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Position",
                table: "TodoTasks",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "TodoTaskListId",
                table: "TodoTasks",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "TodoTaskLists",
                columns: table => new
                {
                    TodoTaskListId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Position = table.Column<int>(type: "int", nullable: false),
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TodoTaskLists", x => x.TodoTaskListId);
                    table.ForeignKey(
                        name: "FK_TodoTaskLists_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_TodoTasks_TodoTaskListId",
                table: "TodoTasks",
                column: "TodoTaskListId");

            migrationBuilder.CreateIndex(
                name: "IX_TodoTaskLists_UserId",
                table: "TodoTaskLists",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_TodoTasks_TodoTaskLists_TodoTaskListId",
                table: "TodoTasks",
                column: "TodoTaskListId",
                principalTable: "TodoTaskLists",
                principalColumn: "TodoTaskListId",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TodoTasks_TodoTaskLists_TodoTaskListId",
                table: "TodoTasks");

            migrationBuilder.DropTable(
                name: "TodoTaskLists");

            migrationBuilder.DropIndex(
                name: "IX_TodoTasks_TodoTaskListId",
                table: "TodoTasks");

            migrationBuilder.DropColumn(
                name: "Position",
                table: "TodoTasks");

            migrationBuilder.DropColumn(
                name: "TodoTaskListId",
                table: "TodoTasks");
        }
    }
}
