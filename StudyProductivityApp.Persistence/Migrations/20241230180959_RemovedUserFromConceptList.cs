using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace StudyProductivityApp.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class RemovedUserFromConceptList : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ConceptLists_Users_UserId",
                table: "ConceptLists");

            migrationBuilder.DropForeignKey(
                name: "FK_Concepts_Users_UserId",
                table: "Concepts");

            migrationBuilder.DropIndex(
                name: "IX_Concepts_UserId",
                table: "Concepts");

            migrationBuilder.DropIndex(
                name: "IX_ConceptLists_UserId",
                table: "ConceptLists");

            migrationBuilder.AlterColumn<string>(
                name: "UserId",
                table: "Concepts",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "UserId",
                table: "ConceptLists",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)",
                oldNullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "UserId",
                table: "Concepts",
                type: "nvarchar(450)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "UserId",
                table: "ConceptLists",
                type: "nvarchar(450)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Concepts_UserId",
                table: "Concepts",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_ConceptLists_UserId",
                table: "ConceptLists",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_ConceptLists_Users_UserId",
                table: "ConceptLists",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Concepts_Users_UserId",
                table: "Concepts",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "UserId");
        }
    }
}
