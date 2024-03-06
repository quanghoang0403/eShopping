﻿using eShopping.Common.Constants;
using eShopping.Common.Extensions;
using eShopping.Domain.Base;
using eShopping.Domain.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Query;
using Microsoft.EntityFrameworkCore.Storage;
using System;
using System.ComponentModel;
using System.Linq;
using System.Linq.Expressions;
using System.Threading;
using System.Threading.Tasks;

namespace eShopping.Infrastructure.Contexts
{
    public class eShoppingDbContext : DbContext
    {
        private readonly IHttpContextAccessor _httpContextAccessor;

        public eShoppingDbContext(
            DbContextOptions<eShoppingDbContext> options,
            IHttpContextAccessor httpContextAccessor) : base(options)
        {
            _httpContextAccessor = httpContextAccessor;
            Database.SetCommandTimeout(120);
        }

        public DbSet<Account> Accounts { get; set; }
        public DbSet<AppConfig> AppConfigs { get; set; }
        public DbSet<Cart> Carts { get; set; }
        public DbSet<ProductCategory> ProductCategories { get; set; }
        public DbSet<City> Cities { get; set; }
        public DbSet<Customer> Customers { get; set; }
        public DbSet<District> Districts { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderItem> OrderItems { get; set; }
        public DbSet<OrderHistory> OrderHistories { get; set; }
        public DbSet<OrderPromotionDetail> OrderPromotionDetails { get; set; }
        public DbSet<Permission> Permissions { get; set; }
        public DbSet<PermissionGroup> PermissionGroups { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<Image> Images { get; set; }
        public DbSet<ProductInCategory> ProductInCategories { get; set; }
        public DbSet<ProductPrice> ProductPrices { get; set; }
        public DbSet<Promotion> Promotions { get; set; }
        public DbSet<PromotionProduct> PromotionProducts { get; set; }
        public DbSet<PromotionProductCategory> PromotionProductCategories { get; set; }
        public DbSet<Staff> Staffs { get; set; }
        public DbSet<StaffPermissionGroup> StaffGroupPermissionBranches { get; set; }
        public DbSet<Ward> Wards { get; set; }


        protected override void OnModelCreating(ModelBuilder builder)
        {
            OverrideQueryFilter(builder);
            builder.Entity<Account>().HasKey(x => x.Id);

            builder.Entity<AppConfig>().HasKey(x => x.Key);

            builder.Entity<Cart>().HasKey(x => x.Id);
            //builder.Entity<Cart>().HasOne(x => x.Customer).WithMany(x => x.Carts).HasForeignKey(x => x.CustomerId);
            //builder.Entity<Cart>().HasOne(x => x.ProductPrice).WithMany(x => x.Carts).HasForeignKey(x => x.ProductPriceId);

            builder.Entity<ProductCategory>().HasKey(x => x.Id);

            builder.Entity<City>().HasKey(x => x.Id);
            //builder.Entity<City>().HasMany(x => x.Customers).WithOne(x => x.City).HasForeignKey(x => x.CityId);

            builder.Entity<Customer>().HasKey(x => x.Id);
            //builder.Entity<Customer>().HasOne(x => x.City).WithMany(x => x.Customers).HasForeignKey(x => x.CityId);
            //builder.Entity<Customer>().HasOne(x => x.District).WithMany(x => x.Customers).HasForeignKey(x => x.DistrictId);
            //builder.Entity<Customer>().HasOne(x => x.Ward).WithMany(x => x.Customers).HasForeignKey(x => x.WardId);

            builder.Entity<District>().HasKey(x => x.Id);
            //builder.Entity<District>().HasMany(x => x.Customers).WithOne(x => x.District).HasForeignKey(x => x.DistrictId);

            builder.Entity<Order>().HasKey(x => x.Id);
            builder.Entity<Order>().HasMany(x => x.OrderItems).WithOne(x => x.Order).HasForeignKey(x => x.OrderId);
            builder.Entity<Order>().HasOne(x => x.Customer).WithMany(x => x.Orders).HasForeignKey(x => x.UserId);

            builder.Entity<OrderItem>().HasKey(x => x.Id);
            builder.Entity<OrderItem>().HasOne(x => x.Order).WithMany(x => x.OrderItems).HasForeignKey(x => x.OrderId);
            builder.Entity<OrderItem>().HasOne(x => x.ProductPrice).WithMany(x => x.OrderItems).HasForeignKey(x => x.ProductPriceId);

            builder.Entity<Permission>().HasKey(x => x.Id);
            builder.Entity<Permission>().HasOne(x => x.PermissionGroup).WithMany(x => x.Permissions).HasForeignKey(x => x.PermissionGroupId);

            builder.Entity<PermissionGroup>().HasKey(x => x.Id);

            builder.Entity<Product>().HasKey(x => x.Id);
            builder.Entity<Product>().HasMany(x => x.ProductInCategories).WithOne(x => x.Product).HasForeignKey(x => x.ProductId);
            builder.Entity<Product>().HasMany(x => x.ProductPrices).WithOne(x => x.Product).HasForeignKey(x => x.ProductId);

            builder.Entity<Image>().HasKey(x => x.Id);

            builder.Entity<ProductInCategory>().HasKey(x => x.Id);
            builder.Entity<ProductInCategory>().HasOne(x => x.Product).WithMany(x => x.ProductInCategories).HasForeignKey(x => x.ProductId);
            builder.Entity<ProductInCategory>().HasOne(x => x.ProductCategory).WithMany(x => x.ProductInCategories).HasForeignKey(x => x.ProductCategoryId);

            builder.Entity<ProductPrice>().HasKey(x => x.Id);
            builder.Entity<ProductPrice>().HasOne(x => x.Product).WithMany(x => x.ProductPrices).HasForeignKey(x => x.ProductId);

            builder.Entity<Promotion>().HasKey(x => x.Id);

            builder.Entity<PromotionProduct>().HasKey(x => new { x.Id });
            builder.Entity<PromotionProduct>()
                .HasOne<Promotion>(sc => sc.Promotion)
                .WithMany(s => s.PromotionProducts)
                .HasForeignKey(sc => sc.PromotionId);
            builder.Entity<PromotionProduct>()
                .HasOne<Product>(sc => sc.Product)
                .WithMany(s => s.PromotionProducts)
                .HasForeignKey(sc => sc.ProductId);

            builder.Entity<PromotionProductCategory>().HasKey(x => new { x.Id });
            builder.Entity<PromotionProductCategory>()
                .HasOne<Promotion>(sc => sc.Promotion)
                .WithMany(s => s.PromotionProductCategories)
                .HasForeignKey(sc => sc.PromotionId);
            builder.Entity<PromotionProductCategory>()
                .HasOne<ProductCategory>(sc => sc.ProductCategory)
                .WithMany(s => s.PromotionProductCategories)
                .HasForeignKey(sc => sc.ProductCategoryId);

            builder.Entity<Staff>().HasKey(x => x.Id);

            builder.Entity<StaffPermissionGroup>().HasKey(x => x.Id);
            builder.Entity<StaffPermissionGroup>().HasOne(x => x.Staff).WithMany(x => x.StaffPermissionGroups).HasForeignKey(x => x.StaffId);

            builder.Entity<Ward>().HasKey(x => x.Id);
            //builder.Entity<Ward>().HasMany(x => x.Customers).WithOne(x => x.Ward).HasForeignKey(x => x.Ward);

            /// Add comment to column from description attribute
            foreach (var property in builder.Model.GetEntityTypes()
            .SelectMany(t => t.GetProperties()))
            {
                if (property.PropertyInfo == null)
                {
                    continue;
                }

                var comment = string.Empty;
                var customAttributes = property.PropertyInfo.GetCustomAttributes(typeof(DescriptionAttribute), false);
                if (customAttributes.Length > 0)
                {
                    comment = ((DescriptionAttribute)customAttributes[0]).Description;
                }

                if (string.IsNullOrEmpty(comment))
                {
                    continue;
                }

                property.SetComment(comment);
            }

            Expression<Func<BaseEntity, bool>> filterExpr = x => !x.IsDeleted;
            foreach (var entityType in builder.Model.GetEntityTypes())
            {
                // Check if current entity type is child of BaseEntity
                if (entityType.ClrType.IsAssignableTo(typeof(BaseEntity)))
                {
                    // Modify expression to handle correct child type
                    var parameter = Expression.Parameter(entityType.ClrType);
                    var body = ReplacingExpressionVisitor.Replace(filterExpr.Parameters.First(), parameter, filterExpr.Body);
                    var lambdaExpression = Expression.Lambda(body, parameter);

                    // Set filter
                    entityType.SetQueryFilter(lambdaExpression);
                }
            }

            base.OnModelCreating(builder);
        }

        public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = new CancellationToken())
        {
            var claimAccountId = _httpContextAccessor.HttpContext == null
                ? null
                : _httpContextAccessor.HttpContext.User.Claims.FirstOrDefault(x => x.Type == ClaimTypesConstants.ACCOUNT_ID);
            var accountId = claimAccountId?.Value.ToGuid();
            foreach (var entry in ChangeTracker.Entries<eShopping.Domain.Base.BaseEntity>())
            {
                switch (entry.State)
                {
                    case EntityState.Added:
                        entry.Entity.CreatedTime = DateTime.UtcNow;
                        entry.Entity.LastSavedTime = DateTime.UtcNow;
                        entry.Entity.CreatedUser = accountId;
                        entry.Entity.LastSavedUser = accountId;
                        entry.CurrentValues["IsDeleted"] = false;
                        break;

                    case EntityState.Modified:
                        entry.Entity.LastSavedTime = DateTime.UtcNow;
                        entry.Entity.LastSavedUser = accountId;
                        break;

                    case EntityState.Deleted:
                        entry.State = EntityState.Modified;
                        entry.Entity.LastSavedTime = DateTime.UtcNow;
                        entry.Entity.LastSavedUser = accountId;
                        entry.CurrentValues["IsDeleted"] = true;
                        break;
                }
            }

            return base.SaveChangesAsync(cancellationToken);
        }

        public Task<IDbContextTransaction> BeginTransactionAsync()
        {
            return Database.BeginTransactionAsync();
        }

        public int ExecuteSql(string sql)
        {
            return Database.ExecuteSqlRaw(sql);
        }

        private void OverrideQueryFilter(ModelBuilder builder)
        {
            builder.Entity<Order>().HasQueryFilter(m => !m.IsDeleted);
            builder.Entity<Customer>().HasQueryFilter(m => !m.IsDeleted);
            builder.Entity<Cart>().HasQueryFilter(m => !m.IsDeleted);
            builder.Entity<ProductCategory>().HasQueryFilter(m => !m.IsDeleted);
            builder.Entity<Customer>().HasQueryFilter(m => !m.IsDeleted);
            builder.Entity<Image>().HasQueryFilter(m => !m.IsDeleted);
            builder.Entity<Order>().HasQueryFilter(m => !m.IsDeleted);
            builder.Entity<OrderItem>().HasQueryFilter(m => !m.IsDeleted);
            builder.Entity<OrderHistory>().HasQueryFilter(m => m.IsDeleted == false);
            builder.Entity<OrderPromotionDetail>().HasQueryFilter(m => m.IsDeleted == false);
            builder.Entity<Permission>().HasQueryFilter(m => !m.IsDeleted);
            builder.Entity<PermissionGroup>().HasQueryFilter(m => !m.IsDeleted);
            builder.Entity<Product>().HasQueryFilter(m => !m.IsDeleted);
            builder.Entity<ProductInCategory>().HasQueryFilter(m => !m.IsDeleted);
            builder.Entity<ProductPrice>().HasQueryFilter(m => !m.IsDeleted);
            builder.Entity<Promotion>().HasQueryFilter(m => !m.IsDeleted);
            builder.Entity<PromotionProduct>().HasQueryFilter(m => !m.IsDeleted);
            builder.Entity<PromotionProductCategory>().HasQueryFilter(m => !m.IsDeleted);
            builder.Entity<Staff>().HasQueryFilter(m => !m.IsDeleted);
            builder.Entity<StaffPermissionGroup>().HasQueryFilter(m => !m.IsDeleted);
        }
    }
}