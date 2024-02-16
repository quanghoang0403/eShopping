using eShopping.Domain.Entities;
using eShopping.Infrastructure.Contexts;
using eShopping.Interfaces.Repositories;

namespace eShopping.Infrastructure.Repositories
{
    public class ProductOptionRepository : GenericRepository<ProductOption>, IProductOptionRepository
    {
        public ProductOptionRepository(eShoppingDbContext dbContext) : base(dbContext) { }
    }
}
