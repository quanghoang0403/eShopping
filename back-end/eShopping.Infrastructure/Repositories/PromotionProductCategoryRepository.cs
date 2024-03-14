using eShopping.Domain.Entities;
using eShopping.Infrastructure.Contexts;
using eShopping.Interfaces.Repositories;

namespace eShopping.Infrastructure.Repositories
{
    public class OrderPromotionDetailRepository : GenericRepository<OrderPromotionDetail>, IOrderPromotionDetailRepository
    {
        public OrderPromotionDetailRepository(eShoppingDbContext dbContext) : base(dbContext)
        {
        }
    }
}