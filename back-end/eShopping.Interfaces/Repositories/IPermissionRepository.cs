using System;
using System.Linq;
using eShopping.Domain.Entities;

namespace eShopping.Interfaces.Repositories
{
    public interface IPermissionRepository : IGenericRepository<Permission>
    {
        IQueryable<Permission> GetPermissionsByPermissionGroupId(Guid permissionGroupId);
    }
}
