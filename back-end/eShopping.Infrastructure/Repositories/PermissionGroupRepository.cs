using eShopping.Interfaces.Repositories;
using eShopping.Infrastructure.Contexts;
using eShopping.Domain.Entities;


namespace eShopping.Infrastructure.Repositories
{
    public class PermissionGroupRepository : GenericRepository<PermissionGroup>, IPermissionGroupRepository
    {
        public PermissionGroupRepository(eShoppingDbContext dbContext) : base(dbContext) { }
    }
}
