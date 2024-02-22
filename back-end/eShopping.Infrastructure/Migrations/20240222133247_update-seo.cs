using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace eShopping.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class updateseo : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "KeywordSEO",
                table: "Product",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: true,
                comment: "SEO Configuration: SEO on Keyword");

            migrationBuilder.AddColumn<string>(
                name: "KeywordSEO",
                table: "Category",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: true,
                comment: "SEO Configuration: SEO on Keyword");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "KeywordSEO",
                table: "Product");

            migrationBuilder.DropColumn(
                name: "KeywordSEO",
                table: "Category");
        }
    }
}
