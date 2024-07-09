using eShopping.Domain.Entities;
using eShopping.Infrastructure.Contexts;
using eShopping.Interfaces.Repositories;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace eShopping.Infrastructure.Repositories
{
    public class RefreshTokenRepository : GenericRepository<RefreshToken>, IRefreshTokenRepository
    {
        public RefreshTokenRepository(eShoppingDbContext dbContext) : base(dbContext) { }

        public async Task<RefreshToken> GetRefreshToken(Guid? accountId)
        {
            var refreshToken = await dbSet.Where(s => s.AccountId == accountId).AsNoTracking().FirstOrDefaultAsync();
            return refreshToken;
        }

        public async void RevokeRefreshToken(Guid accountId)
        {
            var refreshToken = await GetRefreshToken(accountId);
            if (refreshToken != null)
            {
                refreshToken.IsInvoked = true;
                _dbContext.Update(refreshToken);
                await _dbContext.SaveChangesAsync();
            }

        }
    }
}
