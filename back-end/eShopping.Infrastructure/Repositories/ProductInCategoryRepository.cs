using eShopping.Domain.Entities;
using eShopping.Infrastructure.Contexts;
using eShopping.Infrastructure.Repositories;

namespace eShopping.Interfaces.Repositories
{
    public class ProductInCategoryRepository : GenericRepository<ProductInCategory>, IProductInCategoryRepository
    {
        public ProductInCategoryRepository(eShoppingDbContext dbContext) : base(dbContext) { }
    }
}
