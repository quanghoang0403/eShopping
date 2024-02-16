using eShopping.Domain.Entities;
using eShopping.Infrastructure.Contexts;
using eShopping.Interfaces.Repositories;

namespace eShopping.Infrastructure.Repositories
{
    public class AppConfigRepository : GenericRepository<AppConfig>, IAppConfigRepository
    {
        public AppConfigRepository(eShoppingDbContext dbContext) : base(dbContext) { }
    }
}
