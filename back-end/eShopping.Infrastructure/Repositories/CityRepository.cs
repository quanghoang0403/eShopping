using eShopping.Domain.Entities;
using eShopping.Infrastructure.Contexts;
using eShopping.Interfaces.Repositories;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace eShopping.Infrastructure.Repositories
{
    public class CityRepository : GenericRepository<City>, ICityRepository
    {
        public CityRepository(eShoppingDbContext dbContext) : base(dbContext) { }

        public IQueryable<City> GetCities()
        {
            IQueryable<City> cities = dbSet.AsNoTracking();
            return cities;
        }
    }
}
