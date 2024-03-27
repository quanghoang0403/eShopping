using eShopping.Infrastructure.Contexts;
using eShopping.Interfaces;
using eShopping.Interfaces.Repositories;
using Microsoft.EntityFrameworkCore.Storage;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace eShopping.Infrastructure.Repositories
{
    /// <summary>
    /// Repository pattern and unit of work
    /// more detail: https://dev.to/moe23/step-by-step-repository-pattern-and-unit-of-work-with-asp-net-core-5-3l92
    /// updated: https://viblo.asia/p/design-pattern-unit-of-work-pattern-bWrZnozQlxw
    /// </summary>
    public class UnitOfWork : IUnitOfWork, IDisposable
    {
        private readonly eShoppingDbContext _dbContext;

        public UnitOfWork(eShoppingDbContext dbContext)
        {
            _dbContext = dbContext;
        }
        private IAccountRepository _accountRepository;
        public IAccountRepository Accounts { get { return _accountRepository ??= new AccountRepository(_dbContext); } }

        private IAppConfigRepository _appConfigRepository;
        public IAppConfigRepository AppConfigs { get { return _appConfigRepository ??= new AppConfigRepository(_dbContext); } }

        private ICityRepository _cityRepository;
        public ICityRepository Cities { get { return _cityRepository ??= new CityRepository(_dbContext); } }

        private ICartRepository _cartRepository;
        public ICartRepository Carts { get { return _cartRepository ??= new CartRepository(_dbContext); } }

        private IProductCategoryRepository _productCategoryRepository;
        public IProductCategoryRepository ProductCategories { get { return _productCategoryRepository ??= new ProductCategoryRepository(_dbContext); } }

        private ICustomerRepository _customerRepository;
        public ICustomerRepository Customers { get { return _customerRepository ??= new CustomerRepository(_dbContext); } }

        private IDistrictRepository _districtRepository;
        public IDistrictRepository Districts { get { return _districtRepository ??= new DistrictRepository(_dbContext); } }

        private IOrderHistoryRepository _orderHistoryRepository;
        public IOrderHistoryRepository OrderHistories { get { return _orderHistoryRepository ??= new OrderHistoryRepository(_dbContext); } }

        private IOrderRepository _orderRepository;
        public IOrderRepository Orders { get { return _orderRepository ??= new OrderRepository(_dbContext); } }

        private IOrderItemRepository _orderDetailRepository;
        public IOrderItemRepository OrderItems { get { return _orderDetailRepository ??= new OrderItemRepository(_dbContext); } }

        private IPermissionRepository _permissionRepository;
        public IPermissionRepository Permissions { get { return _permissionRepository ??= new PermissionRepository(_dbContext); } }

        private IPermissionGroupRepository _permissionGroupRepository;
        public IPermissionGroupRepository PermissionGroups { get { return _permissionGroupRepository ??= new PermissionGroupRepository(_dbContext); } }

        private IProductRepository _productRepository;
        public IProductRepository Products { get { return _productRepository ??= new ProductRepository(_dbContext); } }

        private IProductInCategoryRepository _productInCategoryRepository;
        public IProductInCategoryRepository ProductInCategories { get { return _productInCategoryRepository ??= new ProductInCategoryRepository(_dbContext); } }

        private IImageRepository _productImageRepository;
        public IImageRepository Images { get { return _productImageRepository ??= new ImageRepository(_dbContext); } }

        private IProductPriceRepository _productPriceRepository;
        public IProductPriceRepository ProductPrices { get { return _productPriceRepository ??= new ProductPriceRepository(_dbContext); } }

        private IStaffRepository _staffRepository;
        public IStaffRepository Staffs { get { return _staffRepository ??= new StaffRepository(_dbContext); } }

        private IStaffPermissionGroupRepository _staffPermissionGroupRepository;
        public IStaffPermissionGroupRepository StaffPermissionGroup { get { return _staffPermissionGroupRepository ??= new StaffPermissionGroupRepository(_dbContext); } }

        private IWardRepository _wardRepository;
        public IWardRepository Wards { get { return _wardRepository ??= new WardRepository(_dbContext); } }

        public async Task SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            await _dbContext.SaveChangesAsync(cancellationToken);
        }

        public async Task<IDbContextTransaction> BeginTransactionAsync(CancellationToken cancellationToken = default)
        {
            return await _dbContext.Database.BeginTransactionAsync(cancellationToken);
        }

        public void Dispose()
        {
            _dbContext.Dispose();
        }
    }
}
