using eShopping.Domain.Entities;
using eShopping.Infrastructure.Contexts;
using eShopping.Interfaces.Repositories;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace eShopping.Infrastructure.Repositories
{
    public class StaffPermissionRepository : GenericRepository<StaffPermission>, IStaffPermissionRepository
    {
        public StaffPermissionRepository(eShoppingDbContext dbContext) : base(dbContext) { }

        public Task<List<StaffPermission>> GetStaffPermissionsByStaffId(Guid staffId)
        {
            var staffGroupPermission = dbSet
                .Where(s => s.StaffId == staffId)
                .Include(s => s.Permission)
                .ThenInclude(g => g.PermissionGroup)
                .AsNoTracking()
                .ToListAsync();
            return staffGroupPermission;
        }

        public Task<List<StaffPermission>> GetStaffPermissionsByStaffIds(IEnumerable<Guid> staffIds)
        {
            var staffGroupPermission = dbSet
                .Where(s => staffIds.Any(sid => sid == s.StaffId))
                .Include(s => s.Permission)
                .ThenInclude(g => g.PermissionGroup)
                .AsNoTracking()
                .ToListAsync();
            return staffGroupPermission;
        }
    }
}
