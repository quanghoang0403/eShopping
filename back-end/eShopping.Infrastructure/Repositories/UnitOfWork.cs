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

        private IRefreshTokenRepository _refreshTokenRepository;
        public IRefreshTokenRepository RefreshTokens { get { return _refreshTokenRepository ??= new RefreshTokenRepository(_dbContext); } }

        private ICityRepository _cityRepository;
        public ICityRepository Cities { get { return _cityRepository ??= new CityRepository(_dbContext); } }

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

        private IOrderPaymentTransactionRepository _orderPaymentTransactionRepository;
        public IOrderPaymentTransactionRepository OrderPaymentTransactions { get { return _orderPaymentTransactionRepository ??= new OrderPaymentTransactionRepository(_dbContext); } }

        private IPermissionRepository _permissionRepository;
        public IPermissionRepository Permissions { get { return _permissionRepository ??= new PermissionRepository(_dbContext); } }

        private IPermissionGroupRepository _permissionGroupRepository;
        public IPermissionGroupRepository PermissionGroups { get { return _permissionGroupRepository ??= new PermissionGroupRepository(_dbContext); } }

        private IProductRepository _productRepository;
        public IProductRepository Products { get { return _productRepository ??= new ProductRepository(_dbContext); } }

        private IProductSizeRepository _productSizeRepository;
        public IProductSizeRepository ProductSizes { get { return _productSizeRepository ??= new ProductSizeRepository(_dbContext); } }

        private IProductSizeCategoryRepository _productSizeCategoryRepository;
        public IProductSizeCategoryRepository ProductSizeCategories { get { return _productSizeCategoryRepository ??= new ProductSizeCategoryRepository(_dbContext); } }

        private IProductStockRepository _productStockRepository;
        public IProductStockRepository ProductStocks { get { return _productStockRepository ??= new ProductStockRepository(_dbContext); } }

        private IProductCategoryRepository _productCategoryRepository;
        public IProductCategoryRepository ProductCategories { get { return _productCategoryRepository ??= new ProductCategoryRepository(_dbContext); } }

        private IProductRootCategoryRepository _productRootCategoryRepository;
        public IProductRootCategoryRepository ProductRootCategories { get { return _productRootCategoryRepository ??= new ProductRootCategoryRepository(_dbContext); } }

        private IImageRepository _productImageRepository;
        public IImageRepository Images { get { return _productImageRepository ??= new ImageRepository(_dbContext); } }

        private IProductVariantRepository _productVariantRepository;
        public IProductVariantRepository ProductVariants { get { return _productVariantRepository ??= new ProductVariantRepository(_dbContext); } }

        private IStaffRepository _staffRepository;
        public IStaffRepository Staffs { get { return _staffRepository ??= new StaffRepository(_dbContext); } }

        private IStaffPermissionRepository _staffPermissionGroupRepository;
        public IStaffPermissionRepository StaffPermission { get { return _staffPermissionGroupRepository ??= new StaffPermissionRepository(_dbContext); } }

        private IWardRepository _wardRepository;
        public IWardRepository Wards { get { return _wardRepository ??= new WardRepository(_dbContext); } }

        private IBlogRepository _blogRepository;
        public IBlogRepository Blogs { get { return _blogRepository ??= new BlogRepository(_dbContext); ; } }

        private IBlogCategoryRepository _blogCategoryRepository;
        public IBlogCategoryRepository BlogCategories { get { return _blogCategoryRepository ??= new BlogCategoryRepository(_dbContext); } }

        private IBlogInCategoryRepository _blogInCategoryRepository;
        public IBlogInCategoryRepository BlogInCategories { get { return _blogInCategoryRepository ??= new BlogInCategoryRepository(_dbContext); } }

        public async Task SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            await _dbContext.SaveChangesAsync(cancellationToken);
        }

        public async Task<IDbContextTransaction> BeginTransactionAsync(CancellationToken cancellationToken = default)
        {
            return await _dbContext.Database.BeginTransactionAsync(cancellationToken);
        }

        public IExecutionStrategy CreateExecutionStrategy()
        {
            return _dbContext.Database.CreateExecutionStrategy();
        }

        public void Dispose()
        {
            _dbContext.Dispose();
        }
    }
}
