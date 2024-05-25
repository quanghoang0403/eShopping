using eShopping.Domain.Entities;
using eShopping.Infrastructure.Contexts;
using eShopping.Interfaces.Repositories;

namespace eShopping.Infrastructure.Repositories
{
    public class ProductSizeRepository : GenericRepository<ProductSize>, IProductSizeRepository
    {
        public ProductSizeRepository(eShoppingDbContext dbContext) : base(dbContext) { }
    }
}
