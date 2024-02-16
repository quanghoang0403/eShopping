using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace eShopping.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class UpdateAccount : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Birthday",
                table: "Staff");

            migrationBuilder.DropColumn(
                name: "FullName",
                table: "Staff");

            migrationBuilder.DropColumn(
                name: "Gender",
                table: "Staff");

            migrationBuilder.DropColumn(
                name: "Thumbnail",
                table: "Staff");

            migrationBuilder.DropColumn(
                name: "Birthday",
                table: "Customer");

            migrationBuilder.DropColumn(
                name: "FullName",
                table: "Customer");

            migrationBuilder.DropColumn(
                name: "Gender",
                table: "Customer");

            migrationBuilder.DropColumn(
                name: "IsOTPVerified",
                table: "Customer");

            migrationBuilder.DropColumn(
                name: "Thumbnail",
                table: "Customer");

            migrationBuilder.DropColumn(
                name: "ValidateCode",
                table: "Account");

            migrationBuilder.AddColumn<DateTime>(
                name: "Birthday",
                table: "Account",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Gender",
                table: "Account",
                type: "int",
                nullable: false,
                defaultValue: 0,
                comment: "1.Male 2.Female 3.Other");

            migrationBuilder.AddColumn<string>(
                name: "Thumbnail",
                table: "Account",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Birthday",
                table: "Account");

            migrationBuilder.DropColumn(
                name: "Gender",
                table: "Account");

            migrationBuilder.DropColumn(
                name: "Thumbnail",
                table: "Account");

            migrationBuilder.AddColumn<DateTime>(
                name: "Birthday",
                table: "Staff",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "FullName",
                table: "Staff",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Gender",
                table: "Staff",
                type: "int",
                nullable: false,
                defaultValue: 0,
                comment: "1.Male 2.Female 3.Other");

            migrationBuilder.AddColumn<string>(
                name: "Thumbnail",
                table: "Staff",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "Birthday",
                table: "Customer",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "FullName",
                table: "Customer",
                type: "nvarchar(250)",
                maxLength: 250,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Gender",
                table: "Customer",
                type: "int",
                nullable: false,
                defaultValue: 0,
                comment: "1.Male 2.Female 3.Other");

            migrationBuilder.AddColumn<bool>(
                name: "IsOTPVerified",
                table: "Customer",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "Thumbnail",
                table: "Customer",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ValidateCode",
                table: "Account",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: true);
        }
    }
}
