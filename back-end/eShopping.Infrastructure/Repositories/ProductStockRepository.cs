using eShopping.Domain.Entities;
using eShopping.Infrastructure.Contexts;
using eShopping.Interfaces.Repositories;

namespace eShopping.Infrastructure.Repositories
{
    public class ProductStockRepository : GenericRepository<ProductStock>, IProductStockRepository
    {
        public ProductStockRepository(eShoppingDbContext dbContext) : base(dbContext) { }
    }
}
