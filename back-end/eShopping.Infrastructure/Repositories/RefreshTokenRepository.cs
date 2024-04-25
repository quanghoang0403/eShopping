using eShopping.Domain.Entities;
using eShopping.Infrastructure.Contexts;
using eShopping.Interfaces.Repositories;

namespace eShopping.Infrastructure.Repositories
{
    public class RefreshTokenRepository : GenericRepository<RefreshToken>, IRefreshTokenRepository
    {
        public RefreshTokenRepository(eShoppingDbContext dbContext) : base(dbContext) { }
    }
}
