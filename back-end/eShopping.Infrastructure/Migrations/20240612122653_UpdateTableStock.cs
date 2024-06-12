using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace eShopping.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class UpdateTableStock : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ProductSizeName",
                table: "ProductStock",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ProductVariantName",
                table: "ProductStock",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsDiscounted",
                table: "Product",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsSoldOut",
                table: "Product",
                type: "bit",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ProductSizeName",
                table: "ProductStock");

            migrationBuilder.DropColumn(
                name: "ProductVariantName",
                table: "ProductStock");

            migrationBuilder.DropColumn(
                name: "IsDiscounted",
                table: "Product");

            migrationBuilder.DropColumn(
                name: "IsSoldOut",
                table: "Product");
        }
    }
}
