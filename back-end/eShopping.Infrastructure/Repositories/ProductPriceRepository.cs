using eShopping.Domain.Entities;
using eShopping.Infrastructure.Contexts;
using eShopping.Interfaces.Repositories;

namespace eShopping.Infrastructure.Repositories
{
    public class ProductPriceRepository : GenericRepository<ProductPrice>, IProductPriceRepository
    {
        public ProductPriceRepository(eShoppingDbContext dbContext) : base(dbContext) { }
    }
}
