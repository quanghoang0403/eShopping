using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace eShopping.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class Transactiontable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "OrderPaymentTransaction",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    OrderId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    PaymentMethodId = table.Column<int>(type: "int", nullable: false),
                    TransactionType = table.Column<int>(type: "int", nullable: true, comment: "Return value: PAYMENT or REFUND"),
                    TransId = table.Column<long>(type: "bigint", nullable: true),
                    OrderInfo = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Amount = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    PaymentUrl = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ResponseData = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    IsSuccess = table.Column<bool>(type: "bit", nullable: false),
                    LastSavedUser = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    LastSavedTime = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CreatedUser = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    CreatedTime = table.Column<DateTime>(type: "datetime2", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OrderPaymentTransaction", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_OrderPaymentTransaction_IsDeleted",
                table: "OrderPaymentTransaction",
                column: "IsDeleted");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "OrderPaymentTransaction");
        }
    }
}
