using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace eShopping.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class updateorder : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "EndDate",
                table: "ProductPrice");

            migrationBuilder.DropColumn(
                name: "StartDate",
                table: "ProductPrice");

            migrationBuilder.AddColumn<float>(
                name: "PercentNumber",
                table: "OrderItem",
                type: "real",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Thumbnail",
                table: "OrderItem",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ShipAddress",
                table: "Order",
                type: "nvarchar(500)",
                maxLength: 500,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ShipCityId",
                table: "Order",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ShipDistrictId",
                table: "Order",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ShipWardId",
                table: "Order",
                type: "int",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PercentNumber",
                table: "OrderItem");

            migrationBuilder.DropColumn(
                name: "Thumbnail",
                table: "OrderItem");

            migrationBuilder.DropColumn(
                name: "ShipAddress",
                table: "Order");

            migrationBuilder.DropColumn(
                name: "ShipCityId",
                table: "Order");

            migrationBuilder.DropColumn(
                name: "ShipDistrictId",
                table: "Order");

            migrationBuilder.DropColumn(
                name: "ShipWardId",
                table: "Order");

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
        }
    }
}
