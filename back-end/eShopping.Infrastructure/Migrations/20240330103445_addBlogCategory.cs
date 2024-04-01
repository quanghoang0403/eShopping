using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace eShopping.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class addBlogCategory : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "BlogCategories",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Priority = table.Column<int>(type: "int", nullable: false),
                    Color = table.Column<int>(type: "int", nullable: false),
                    LastSavedUser = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    LastSavedTime = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CreatedUser = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    CreatedTime = table.Column<DateTime>(type: "datetime2", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    Content = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    KeywordSEO = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true, comment: "SEO Configuration: SEO on Keyword"),
                    UrlSEO = table.Column<string>(type: "nvarchar(2048)", maxLength: 2048, nullable: true, comment: "SEO Configuration: URL Link"),
                    TitleSEO = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true, comment: "SEO Configuration: SEO on Title"),
                    DescriptionSEO = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true, comment: "SEO Configuration: SEO on Description"),
                    Description = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BlogCategories", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "BlogInCategory",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    blogId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    categoryId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    LastSavedUser = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    LastSavedTime = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CreatedUser = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    CreatedTime = table.Column<DateTime>(type: "datetime2", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BlogInCategory", x => x.Id);
                    table.ForeignKey(
                        name: "FK_BlogInCategory_BlogCategories_categoryId",
                        column: x => x.categoryId,
                        principalTable: "BlogCategories",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_BlogInCategory_Blogs_blogId",
                        column: x => x.blogId,
                        principalTable: "Blogs",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_BlogCategories_IsDeleted",
                table: "BlogCategories",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_BlogInCategory_blogId",
                table: "BlogInCategory",
                column: "blogId");

            migrationBuilder.CreateIndex(
                name: "IX_BlogInCategory_categoryId",
                table: "BlogInCategory",
                column: "categoryId");

            migrationBuilder.CreateIndex(
                name: "IX_BlogInCategory_IsDeleted",
                table: "BlogInCategory",
                column: "IsDeleted");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "BlogInCategory");

            migrationBuilder.DropTable(
                name: "BlogCategories");
        }
    }
}
