using eShopping.Domain.Entities;
using eShopping.Infrastructure.Contexts;
using eShopping.Interfaces.Repositories;

namespace eShopping.Infrastructure.Repositories
{
    public class PromotionProductCategoryRepository : GenericRepository<PromotionProductCategory>, IPromotionProductCategoryRepository
    {
        public PromotionProductCategoryRepository(eShoppingDbContext dbContext) : base(dbContext)
        {
        }
    }
}