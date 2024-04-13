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

        IAccountRepository Accounts { get; }

        IAppConfigRepository AppConfigs { get; }

        ICartRepository Carts { get; }

        IProductCategoryRepository ProductCategories { get; }

        ICityRepository Cities { get; }

        ICustomerRepository Customers { get; }

        IDistrictRepository Districts { get; }

        IOrderRepository Orders { get; }

        IOrderHistoryRepository OrderHistories { get; }

        IOrderItemRepository OrderItems { get; }

        IPermissionRepository Permissions { get; }

        IPermissionGroupRepository PermissionGroups { get; }

        IProductRepository Products { get; }

        IImageRepository Images { get; }

        IProductPriceRepository ProductPrices { get; }

        IProductInCategoryRepository ProductInCategories { get; }

        IStaffRepository Staffs { get; }

        IStaffPermissionRepository StaffPermission { get; }

        IWardRepository Wards { get; }
        IBlogRepository Blogs { get; }
        IBlogCategoryRepository BlogCategories { get; }
        IBlogInCategoryRepository BlogInCategories { get; }
    }
}