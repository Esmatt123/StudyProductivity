using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace StudyProductivityApp.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddedConceptList : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ConceptListId",
                table: "Concepts",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "ConceptLists",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Title = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ConceptLists", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ConceptLists_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "UserId");
                });

            migrationBuilder.CreateIndex(
                name: "IX_Concepts_ConceptListId",
                table: "Concepts",
                column: "ConceptListId");

            migrationBuilder.CreateIndex(
                name: "IX_ConceptLists_UserId",
                table: "ConceptLists",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Concepts_ConceptLists_ConceptListId",
                table: "Concepts",
                column: "ConceptListId",
                principalTable: "ConceptLists",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Concepts_ConceptLists_ConceptListId",
                table: "Concepts");

            migrationBuilder.DropTable(
                name: "ConceptLists");

            migrationBuilder.DropIndex(
                name: "IX_Concepts_ConceptListId",
                table: "Concepts");

            migrationBuilder.DropColumn(
                name: "ConceptListId",
                table: "Concepts");
        }
    }
}
