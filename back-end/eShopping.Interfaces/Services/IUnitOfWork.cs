using eShopping.Interfaces.Repositories;
using Microsoft.EntityFrameworkCore.Storage;
using System.Threading;
using System.Threading.Tasks;

namespace eShopping.Interfaces
{
    public interface IUnitOfWork
    {
        Task SaveChangesAsync(CancellationToken cancellationToken = default);

        Task<IDbContextTransaction> BeginTransactionAsync(CancellationToken cancellationToken = default);

        IExecutionStrategy CreateExecutionStrategy();

        IAccountRepository Accounts { get; }

        IRefreshTokenRepository RefreshTokens { get; }

        ICityRepository Cities { get; }

        ICustomerRepository Customers { get; }

        IDistrictRepository Districts { get; }

        IOrderRepository Orders { get; }

        IOrderHistoryRepository OrderHistories { get; }

        IOrderItemRepository OrderItems { get; }

        IOrderPaymentTransactionRepository OrderPaymentTransactions { get; }

        IPermissionRepository Permissions { get; }

        IPermissionGroupRepository PermissionGroups { get; }

        IProductRepository Products { get; }

        IImageRepository Images { get; }

        IProductVariantRepository ProductVariants { get; }

        IProductSizeRepository ProductSizes { get; }

        IProductSizeCategoryRepository ProductSizeCategories { get; }

        IProductStockRepository ProductStocks { get; }

        IProductCategoryRepository ProductCategories { get; }

        IProductRootCategoryRepository ProductRootCategories { get; }

        IStaffRepository Staffs { get; }

        IStaffPermissionRepository StaffPermission { get; }

        IWardRepository Wards { get; }

        IBlogRepository Blogs { get; }

        IBlogCategoryRepository BlogCategories { get; }

        IBlogInCategoryRepository BlogInCategories { get; }
    }
}