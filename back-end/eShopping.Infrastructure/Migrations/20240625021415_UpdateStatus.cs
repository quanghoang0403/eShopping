using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace eShopping.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class UpdateStatus : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Status",
                table: "Product");

            migrationBuilder.DropColumn(
                name: "Status",
                table: "Blogs");

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                table: "StaffPermission",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                table: "Staff",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                table: "ProductVariant",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                table: "ProductSizeCategory",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                table: "ProductSize",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                table: "ProductRootCategory",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                table: "ProductCategory",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                table: "Product",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                table: "PermissionGroup",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                table: "Permission",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                table: "OrderPaymentTransaction",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                table: "OrderItem",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                table: "OrderHistory",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                table: "Order",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                table: "Image",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                table: "Customer",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                table: "Blogs",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                table: "BlogCategories",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                table: "Account",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsActive",
                table: "StaffPermission");

            migrationBuilder.DropColumn(
                name: "IsActive",
                table: "Staff");

            migrationBuilder.DropColumn(
                name: "IsActive",
                table: "ProductVariant");

            migrationBuilder.DropColumn(
                name: "IsActive",
                table: "ProductSizeCategory");

            migrationBuilder.DropColumn(
                name: "IsActive",
                table: "ProductSize");

            migrationBuilder.DropColumn(
                name: "IsActive",
                table: "ProductRootCategory");

            migrationBuilder.DropColumn(
                name: "IsActive",
                table: "ProductCategory");

            migrationBuilder.DropColumn(
                name: "IsActive",
                table: "Product");

            migrationBuilder.DropColumn(
                name: "IsActive",
                table: "PermissionGroup");

            migrationBuilder.DropColumn(
                name: "IsActive",
                table: "Permission");

            migrationBuilder.DropColumn(
                name: "IsActive",
                table: "OrderPaymentTransaction");

            migrationBuilder.DropColumn(
                name: "IsActive",
                table: "OrderItem");

            migrationBuilder.DropColumn(
                name: "IsActive",
                table: "OrderHistory");

            migrationBuilder.DropColumn(
                name: "IsActive",
                table: "Order");

            migrationBuilder.DropColumn(
                name: "IsActive",
                table: "Image");

            migrationBuilder.DropColumn(
                name: "IsActive",
                table: "Customer");

            migrationBuilder.DropColumn(
                name: "IsActive",
                table: "Blogs");

            migrationBuilder.DropColumn(
                name: "IsActive",
                table: "BlogCategories");

            migrationBuilder.DropColumn(
                name: "IsActive",
                table: "Account");

            migrationBuilder.AddColumn<int>(
                name: "Status",
                table: "Product",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "Status",
                table: "Blogs",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }
    }
}
