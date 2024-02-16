using eShopping.Domain.Entities;
using System.Linq;

namespace eShopping.Interfaces.Repositories
{
    public interface IDistrictRepository : IGenericRepository<District>
    {
        IQueryable<District> GetDistrictsByCityId(int cityId);
    }
}
