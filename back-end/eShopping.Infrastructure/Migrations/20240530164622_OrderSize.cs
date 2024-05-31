using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace eShopping.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class OrderSize : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Priority",
                table: "ProductSizeCategory");

            migrationBuilder.AddColumn<int>(
                name: "Priority",
                table: "ProductSize",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Priority",
                table: "ProductSize");

            migrationBuilder.AddColumn<int>(
                name: "Priority",
                table: "ProductSizeCategory",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }
    }
}
