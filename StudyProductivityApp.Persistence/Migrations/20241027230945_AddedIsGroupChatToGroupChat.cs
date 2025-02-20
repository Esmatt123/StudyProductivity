﻿using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace StudyProductivityApp.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddedIsGroupChatToGroupChat : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsGroupChat",
                table: "GroupChats",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsGroupChat",
                table: "GroupChats");
        }
    }
}
