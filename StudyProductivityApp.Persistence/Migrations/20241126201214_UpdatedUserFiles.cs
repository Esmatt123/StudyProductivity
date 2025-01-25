using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace StudyProductivityApp.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class UpdatedUserFiles : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<TimeSpan>(
                name: "Duration",
                table: "UserFiles",
                type: "time",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Resolution",
                table: "UserFiles",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ThumbnailPath",
                table: "UserFiles",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Duration",
                table: "UserFiles");

            migrationBuilder.DropColumn(
                name: "Resolution",
                table: "UserFiles");

            migrationBuilder.DropColumn(
                name: "ThumbnailPath",
                table: "UserFiles");
        }
    }
}
