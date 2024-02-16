using eShopping.Interfaces.Repositories;
using eShopping.Infrastructure.Contexts;
using eShopping.Domain.Entities;
using System.Linq;
using System;

namespace eShopping.Infrastructure.Repositories
{
    public class PermissionRepository : GenericRepository<Permission>, IPermissionRepository
    {
        public PermissionRepository(eShoppingDbContext dbContext) : base(dbContext) { }

        public IQueryable<Permission> GetPermissionsByPermissionGroupId(Guid permissionGroupId)
        {
            var permissions = dbSet.Where(permission => permission.PermissionGroupId == permissionGroupId);

            return permissions;
        }
    }
}
