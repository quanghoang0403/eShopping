using eShopping.Domain.Entities;
using eShopping.Infrastructure.Contexts;
using eShopping.Interfaces.Repositories;
using System.Linq;

namespace eShopping.Infrastructure.Repositories
{
    public class DistrictRepository : GenericRepository<District>, IDistrictRepository
    {
        public DistrictRepository(eShoppingDbContext dbContext) : base(dbContext) { }

        public IQueryable<District> GetDistrictsByCityId(int cityId)
        {
            IQueryable<District> districts = dbSet.Where(c => c.CityId == cityId);
            return districts;
        }
    }
}
