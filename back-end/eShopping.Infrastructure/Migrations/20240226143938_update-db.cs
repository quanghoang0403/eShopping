using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace eShopping.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class updatedb : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Title",
                table: "Product",
                newName: "Name");

            migrationBuilder.RenameColumn(
                name: "Title",
                table: "Category",
                newName: "Name");

            migrationBuilder.AddColumn<int>(
                name: "Priority",
                table: "Product",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "Thumbnail",
                table: "Product",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Priority",
                table: "Product");

            migrationBuilder.DropColumn(
                name: "Thumbnail",
                table: "Product");

            migrationBuilder.RenameColumn(
                name: "Name",
                table: "Product",
                newName: "Title");

            migrationBuilder.RenameColumn(
                name: "Name",
                table: "Category",
                newName: "Title");
        }
    }
}
