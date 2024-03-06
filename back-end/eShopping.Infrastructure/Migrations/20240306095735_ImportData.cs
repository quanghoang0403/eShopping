using Microsoft.EntityFrameworkCore.Migrations;
using System;
using System.IO;

#nullable disable

namespace eShopping.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class ImportData : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            var sqlFile = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, @"Migrations/StaticData/cities.sql");
            var script = File.ReadAllText(sqlFile);
            migrationBuilder.Sql(script);

            sqlFile = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, @"Migrations/StaticData/districts.sql");
            script = File.ReadAllText(sqlFile);
            migrationBuilder.Sql(script);

            sqlFile = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, @"Migrations/StaticData/wards.sql");
            script = File.ReadAllText(sqlFile);
            migrationBuilder.Sql(script);

            sqlFile = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, @"Migrations/StaticData/permission-groups.sql");
            script = File.ReadAllText(sqlFile);
            migrationBuilder.Sql(script);

            sqlFile = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, @"Migrations/StaticData/permissions.sql");
            script = File.ReadAllText(sqlFile);
            migrationBuilder.Sql(script);

            sqlFile = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, @"Migrations/StaticData/account.sql");
            script = File.ReadAllText(sqlFile);
            migrationBuilder.Sql(script);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {

        }
    }
}
