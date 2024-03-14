using eShopping.Domain.Entities;
using System;
using System.Threading.Tasks;

namespace eShopping.Interfaces.Repositories
{
    public interface IPromotionRepository : IGenericRepository<Promotion>
    {
        Task<Promotion> GetPromotionByIdAsync(Guid id);
    }
}
