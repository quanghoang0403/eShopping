using eShopping.Common.Constants;
using eShopping.Common.Extensions;
using eShopping.Domain.Base;
using eShopping.Domain.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;
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
            DbContextOptions<eShoppingDbContext> variants,
            IHttpContextAccessor httpContextAccessor) : base(variants)
        {
            _httpContextAccessor = httpContextAccessor;
            Database.SetCommandTimeout(240);
        }

        public DbSet<Account> Accounts { get; set; }
        public DbSet<RefreshToken> AppConfigs { get; set; }
        public DbSet<Blog> Blogs { get; set; }
        public DbSet<BlogCategory> BlogCategories { get; set; }
        public DbSet<BlogInCategory> BlogInCategories { get; set; }
        public DbSet<City> Cities { get; set; }
        public DbSet<Customer> Customers { get; set; }
        public DbSet<District> Districts { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderItem> OrderItems { get; set; }
        public DbSet<OrderHistory> OrderHistories { get; set; }
        public DbSet<OrderPaymentTransaction> OrderPaymentTransactions { get; set; }
        public DbSet<Permission> Permissions { get; set; }
        public DbSet<PermissionGroup> PermissionGroups { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<ProductCategory> ProductCategories { get; set; }
        public DbSet<ProductRootCategory> ProductRootCategories { get; set; }
        public DbSet<ProductVariant> ProductVariants { get; set; }
        public DbSet<ProductSizeCategory> ProductSizeCategories { get; set; }
        public DbSet<ProductSize> ProductSizes { get; set; }
        public DbSet<ProductStock> ProductStocks { get; set; }
        public DbSet<Image> Images { get; set; }
        public DbSet<Staff> Staffs { get; set; }
        public DbSet<StaffPermission> StaffPermissionsBranches { get; set; }
        public DbSet<Ward> Wards { get; set; }


        protected override void OnModelCreating(ModelBuilder builder)
        {
            OverrideQueryFilter(builder);

            builder.Entity<Account>().HasKey(x => x.Id);

            builder.Entity<Blog>().HasKey(x => x.Id);
            builder.Entity<BlogCategory>().HasKey(x => x.Id);

            builder.Entity<BlogInCategory>().HasKey(x => new { x.BlogId, x.BlogCategoryId });
            builder.Entity<BlogInCategory>().HasOne(x => x.Blog).WithMany(x => x.BlogInCategories).HasForeignKey(x => x.BlogId).IsRequired(false);
            builder.Entity<BlogInCategory>().HasOne(x => x.BlogCategory).WithMany(x => x.BlogInCategories).HasForeignKey(x => x.BlogCategoryId).IsRequired(false);

            builder.Entity<City>().HasKey(x => x.Id);
            builder.Entity<City>().HasMany(x => x.Districts).WithOne(x => x.City).HasForeignKey(x => x.CityId).OnDelete(DeleteBehavior.Restrict); ;
            builder.Entity<City>().HasMany(x => x.Wards).WithOne(x => x.City).HasForeignKey(x => x.CityId).OnDelete(DeleteBehavior.Restrict); ;

            builder.Entity<District>().HasKey(x => x.Id);
            builder.Entity<District>().HasMany(x => x.Wards).WithOne(x => x.District).HasForeignKey(x => x.DistrictId).OnDelete(DeleteBehavior.Restrict); ;

            builder.Entity<Ward>().HasKey(x => x.Id);

            builder.Entity<Customer>().HasKey(x => x.Id);
            builder.Entity<Customer>().HasOne(x => x.City).WithMany(x => x.Customers).HasForeignKey(x => x.CityId);
            builder.Entity<Customer>().HasOne(x => x.District).WithMany(x => x.Customers).HasForeignKey(x => x.DistrictId);
            builder.Entity<Customer>().HasOne(x => x.Ward).WithMany(x => x.Customers).HasForeignKey(x => x.WardId);

            builder.Entity<Order>().HasKey(x => x.Id);
            builder.Entity<Order>().HasMany(x => x.OrderItems).WithOne(x => x.Order).HasForeignKey(x => x.OrderId);
            builder.Entity<Order>().HasOne(x => x.Customer).WithMany(x => x.Orders).HasForeignKey(x => x.CustomerId);

            builder.Entity<OrderItem>().HasKey(x => x.Id);
            //builder.Entity<OrderItem>().HasOne(x => x.Order).WithMany(x => x.OrderItems).HasForeignKey(x => x.OrderId);

            builder.Entity<Image>().HasKey(x => x.Id);

            builder.Entity<Product>().HasKey(x => x.Id);
            builder.Entity<Product>()
                .HasOne(x => x.ProductCategory)
                .WithMany(x => x.Products)
                .HasForeignKey(x => x.ProductCategoryId)
                .OnDelete(DeleteBehavior.Restrict);
            builder.Entity<Product>()
                .HasOne(x => x.ProductRootCategory)
                .WithMany(x => x.Products)
                .HasForeignKey(x => x.ProductRootCategoryId)
                .OnDelete(DeleteBehavior.Restrict);
            //builder.Entity<Product>().HasMany(x => x.ProductVariants).WithOne(x => x.Product).HasForeignKey(x => x.ProductId);
            //builder.Entity<Product>().HasMany(x => x.ProductStocks).WithOne(x => x.Product).HasForeignKey(x => x.ProductId);

            builder.Entity<ProductVariant>().HasKey(x => x.Id);
            builder.Entity<ProductVariant>().HasOne(x => x.Product).WithMany(x => x.ProductVariants).HasForeignKey(x => x.ProductId);

            builder.Entity<ProductStock>().HasKey(x => new { x.ProductId, x.ProductSizeId, x.ProductVariantId });
            builder.Entity<ProductStock>().HasOne(x => x.Product).WithMany(x => x.ProductStocks).HasForeignKey(x => x.ProductId).IsRequired(false);

            builder.Entity<ProductSize>().HasKey(x => x.Id);
            builder.Entity<ProductSize>().HasOne(x => x.ProductSizeCategory).WithMany(x => x.ProductSizes).HasForeignKey(x => x.ProductSizeCategoryId);

            builder.Entity<ProductSizeCategory>().HasKey(x => x.Id);
            //builder.Entity<ProductSizeCategory>().HasMany(x => x.ProductSizes).WithOne(x => x.ProductSizeCategory).HasForeignKey(x => x.ProductSizeCategoryId);

            builder.Entity<ProductCategory>().HasKey(x => x.Id);
            //builder.Entity<ProductCategory>()
            //    .HasOne(x => x.ProductRootCategory)
            //    .WithMany(x => x.ProductCategories)
            //    .HasForeignKey(x => x.ProductRootCategoryId);
            //builder.Entity<ProductCategory>().HasMany(x => x.Products)
            //    .WithOne(x => x.ProductCategory)
            //    .HasForeignKey(x => x.ProductCategoryId);

            builder.Entity<ProductRootCategory>().HasKey(x => x.Id);
            builder.Entity<ProductRootCategory>().HasMany(x => x.ProductCategories).WithOne(x => x.ProductRootCategory).HasForeignKey(x => x.ProductRootCategoryId);
            //builder.Entity<ProductRootCategory>().HasMany(x => x.Products).WithOne(x => x.ProductRootCategory).HasForeignKey(x => x.ProductRootCategoryId);

            builder.Entity<PermissionGroup>().HasKey(x => x.Id);
            builder.Entity<Permission>().HasKey(x => x.Id);
            builder.Entity<Permission>().HasOne(x => x.PermissionGroup).WithMany(x => x.Permissions).HasForeignKey(x => x.PermissionGroupId);

            builder.Entity<Staff>().HasKey(x => x.Id);

            builder.Entity<StaffPermission>().HasKey(x => x.Id);
            builder.Entity<StaffPermission>().HasOne(x => x.Staff).WithMany(x => x.StaffPermissions).HasForeignKey(x => x.StaffId);

            builder.Entity<Account>().Property(u => u.Code).Metadata.SetAfterSaveBehavior(PropertySaveBehavior.Ignore);
            builder.Entity<Product>().Property(u => u.Code).Metadata.SetAfterSaveBehavior(PropertySaveBehavior.Ignore);
            builder.Entity<Order>().Property(u => u.Code).Metadata.SetAfterSaveBehavior(PropertySaveBehavior.Ignore);

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
                        entry.Entity.CreatedTime = DateTime.Now;
                        entry.Entity.LastSavedTime = DateTime.Now;
                        entry.Entity.CreatedUser = accountId;
                        entry.Entity.LastSavedUser = accountId;
                        entry.CurrentValues["IsDeleted"] = false;
                        break;

                    case EntityState.Modified:
                        entry.Entity.LastSavedTime = DateTime.Now;
                        entry.Entity.LastSavedUser = accountId;
                        break;

                    case EntityState.Deleted:
                        entry.State = EntityState.Modified;
                        entry.Entity.LastSavedTime = DateTime.Now;
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
            builder.Entity<Customer>().HasQueryFilter(m => !m.IsDeleted);
            builder.Entity<Image>().HasQueryFilter(m => !m.IsDeleted);
            builder.Entity<Order>().HasQueryFilter(m => !m.IsDeleted);
            builder.Entity<OrderItem>().HasQueryFilter(m => !m.IsDeleted);
            builder.Entity<OrderHistory>().HasQueryFilter(m => m.IsDeleted == false);
            builder.Entity<Permission>().HasQueryFilter(m => !m.IsDeleted);
            builder.Entity<PermissionGroup>().HasQueryFilter(m => !m.IsDeleted);
            builder.Entity<Product>().HasQueryFilter(m => !m.IsDeleted);
            builder.Entity<ProductSizeCategory>().HasQueryFilter(m => !m.IsDeleted);
            builder.Entity<ProductCategory>().HasQueryFilter(m => !m.IsDeleted);
            builder.Entity<ProductRootCategory>().HasQueryFilter(m => !m.IsDeleted);
            builder.Entity<ProductVariant>().HasQueryFilter(m => !m.IsDeleted);
            builder.Entity<Blog>().HasQueryFilter(m => !m.IsDeleted);
            builder.Entity<BlogCategory>().HasQueryFilter(m => !m.IsDeleted);
            builder.Entity<Staff>().HasQueryFilter(m => !m.IsDeleted);
            builder.Entity<StaffPermission>().HasQueryFilter(m => !m.IsDeleted);
        }
    }
}