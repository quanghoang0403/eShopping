using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace eShopping.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class Transaction : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "OrderPaymentStatusId",
                table: "Order",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "PaymentMethodId",
                table: "Order",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "OrderPaymentStatusId",
                table: "Order");

            migrationBuilder.DropColumn(
                name: "PaymentMethodId",
                table: "Order");
        }
    }
}
