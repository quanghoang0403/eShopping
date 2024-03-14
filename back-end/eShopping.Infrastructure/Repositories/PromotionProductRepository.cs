using eShopping.Domain.Entities;
using eShopping.Infrastructure.Contexts;
using eShopping.Interfaces.Repositories;

namespace eShopping.Infrastructure.Repositories
{
    public class PromotionProductRepository : GenericRepository<PromotionProduct>, IPromotionProductRepository
    {
        public PromotionProductRepository(eShoppingDbContext dbContext) : base(dbContext)
        {
        }
    }
}