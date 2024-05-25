using eShopping.Domain.Entities;
using eShopping.Infrastructure.Contexts;
using eShopping.Interfaces.Repositories;

namespace eShopping.Infrastructure.Repositories
{
    public class ProductSizeCategoryRepository : GenericRepository<ProductSizeCategory>, IProductSizeCategoryRepository
    {
        public ProductSizeCategoryRepository(eShoppingDbContext dbContext) : base(dbContext) { }
    }
}
