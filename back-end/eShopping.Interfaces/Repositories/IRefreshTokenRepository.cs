using eShopping.Domain.Entities;
using System;
using System.Threading.Tasks;

namespace eShopping.Interfaces.Repositories
{
    public interface IRefreshTokenRepository : IGenericRepository<RefreshToken>
    {
        Task<RefreshToken> GetRefreshToken(Guid? accountId);

        void RevokeRefreshToken(Guid accountId);
    }
}
