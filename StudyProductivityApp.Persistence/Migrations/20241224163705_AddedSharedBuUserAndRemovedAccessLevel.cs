using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace StudyProductivityApp.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddedSharedBuUserAndRemovedAccessLevel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AccessLevel",
                table: "UserFileAccesses");

            migrationBuilder.AddColumn<string>(
                name: "SharedByUserId",
                table: "UserFileAccesses",
                type: "nvarchar(450)",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_UserFileAccesses_SharedByUserId",
                table: "UserFileAccesses",
                column: "SharedByUserId");

            migrationBuilder.AddForeignKey(
                name: "FK_UserFileAccesses_Users_SharedByUserId",
                table: "UserFileAccesses",
                column: "SharedByUserId",
                principalTable: "Users",
                principalColumn: "UserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UserFileAccesses_Users_SharedByUserId",
                table: "UserFileAccesses");

            migrationBuilder.DropIndex(
                name: "IX_UserFileAccesses_SharedByUserId",
                table: "UserFileAccesses");

            migrationBuilder.DropColumn(
                name: "SharedByUserId",
                table: "UserFileAccesses");

            migrationBuilder.AddColumn<string>(
                name: "AccessLevel",
                table: "UserFileAccesses",
                type: "nvarchar(max)",
                nullable: true);
        }
    }
}
