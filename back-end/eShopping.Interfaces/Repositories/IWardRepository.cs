using eShopping.Domain.Entities;
using System.Linq;

namespace eShopping.Interfaces.Repositories
{
    public interface IWardRepository : IGenericRepository<Ward>
    {
        IQueryable<Ward> GetWardsByDistrictId(int districtId);
    }
}
