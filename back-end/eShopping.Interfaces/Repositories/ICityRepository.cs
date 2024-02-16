using eShopping.Domain.Entities;
using System.Linq;

namespace eShopping.Interfaces.Repositories
{
    public interface ICityRepository : IGenericRepository<City>
    {
        IQueryable<City> GetCities();
    }
}
