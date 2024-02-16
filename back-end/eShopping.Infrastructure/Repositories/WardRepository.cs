using eShopping.Domain.Entities;
using eShopping.Infrastructure.Contexts;
using eShopping.Interfaces.Repositories;
using System.Linq;

namespace eShopping.Infrastructure.Repositories
{
    public class WardRepository : GenericRepository<Ward>, IWardRepository
    {
        public WardRepository(eShoppingDbContext dbContext) : base(dbContext) { }

        public IQueryable<Ward> GetWardsByDistrictId(int districtId)
        {
            IQueryable<Ward> wards = dbSet.Where(c => c.DistrictId == districtId);

            return wards;
        }
    }
}
