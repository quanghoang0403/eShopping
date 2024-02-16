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

        ICategoryRepository Categories { get; }

        ICityRepository Cities { get; }

        ICustomerRepository Customers { get; }

        IDistrictRepository Districts { get; }

        IOrderRepository Orders { get; }

        IOrderDetailRepository OrderDetails { get; }

        IPermissionRepository Permissions { get; }

        IPermissionGroupRepository PermissionGroups { get; }

        IProductRepository Products { get; }

        IImageRepository Images { get; }

        IProductOptionRepository ProductOptions { get; }

        IProductInCategoryRepository ProductInCategories { get; }

        IPromotionRepository Promotions { get; }

        IStaffRepository Staffs { get; }

        IStaffPermissionGroupRepository StaffPermissionGroup { get; }

        IWardRepository Wards { get; }

    }
}