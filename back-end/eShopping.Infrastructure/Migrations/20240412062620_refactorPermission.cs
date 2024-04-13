using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace eShopping.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class refactorPermission : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Staff_PermissionGroup_PermissionGroupId",
                table: "Staff");

            migrationBuilder.DropTable(
                name: "StaffPermissionGroup");

            migrationBuilder.RenameColumn(
                name: "PermissionGroupId",
                table: "Staff",
                newName: "PermissionId");

            migrationBuilder.RenameIndex(
                name: "IX_Staff_PermissionGroupId",
                table: "Staff",
                newName: "IX_Staff_PermissionId");

            migrationBuilder.AddColumn<DateTime>(
                name: "EndDate",
                table: "ProductPrice",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "StartDate",
                table: "ProductPrice",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.CreateTable(
                name: "StaffPermission",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    StaffId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    PermissionId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    LastSavedUser = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    LastSavedTime = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CreatedUser = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    CreatedTime = table.Column<DateTime>(type: "datetime2", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_StaffPermission", x => x.Id);
                    table.ForeignKey(
                        name: "FK_StaffPermission_Permission_PermissionId",
                        column: x => x.PermissionId,
                        principalTable: "Permission",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_StaffPermission_Staff_StaffId",
                        column: x => x.StaffId,
                        principalTable: "Staff",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_StaffPermission_IsDeleted",
                table: "StaffPermission",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_StaffPermission_PermissionId",
                table: "StaffPermission",
                column: "PermissionId");

            migrationBuilder.CreateIndex(
                name: "IX_StaffPermission_StaffId",
                table: "StaffPermission",
                column: "StaffId");

            migrationBuilder.AddForeignKey(
                name: "FK_Staff_Permission_PermissionId",
                table: "Staff",
                column: "PermissionId",
                principalTable: "Permission",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Staff_Permission_PermissionId",
                table: "Staff");

            migrationBuilder.DropTable(
                name: "StaffPermission");

            migrationBuilder.DropColumn(
                name: "EndDate",
                table: "ProductPrice");

            migrationBuilder.DropColumn(
                name: "StartDate",
                table: "ProductPrice");

            migrationBuilder.RenameColumn(
                name: "PermissionId",
                table: "Staff",
                newName: "PermissionGroupId");

            migrationBuilder.RenameIndex(
                name: "IX_Staff_PermissionId",
                table: "Staff",
                newName: "IX_Staff_PermissionGroupId");

            migrationBuilder.CreateTable(
                name: "StaffPermissionGroup",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    PermissionGroupId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    StaffId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CreatedTime = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CreatedUser = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    LastSavedTime = table.Column<DateTime>(type: "datetime2", nullable: true),
                    LastSavedUser = table.Column<Guid>(type: "uniqueidentifier", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_StaffPermissionGroup", x => x.Id);
                    table.ForeignKey(
                        name: "FK_StaffPermissionGroup_PermissionGroup_PermissionGroupId",
                        column: x => x.PermissionGroupId,
                        principalTable: "PermissionGroup",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_StaffPermissionGroup_Staff_StaffId",
                        column: x => x.StaffId,
                        principalTable: "Staff",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_StaffPermissionGroup_IsDeleted",
                table: "StaffPermissionGroup",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_StaffPermissionGroup_PermissionGroupId",
                table: "StaffPermissionGroup",
                column: "PermissionGroupId");

            migrationBuilder.CreateIndex(
                name: "IX_StaffPermissionGroup_StaffId",
                table: "StaffPermissionGroup",
                column: "StaffId");

            migrationBuilder.AddForeignKey(
                name: "FK_Staff_PermissionGroup_PermissionGroupId",
                table: "Staff",
                column: "PermissionGroupId",
                principalTable: "PermissionGroup",
                principalColumn: "Id");
        }
    }
}
