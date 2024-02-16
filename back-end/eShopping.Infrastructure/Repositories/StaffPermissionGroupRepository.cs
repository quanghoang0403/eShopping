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
    public class StaffPermissionGroupRepository : GenericRepository<StaffPermissionGroup>, IStaffPermissionGroupRepository
    {
        public StaffPermissionGroupRepository(eShoppingDbContext dbContext) : base(dbContext) { }

        public Task<List<StaffPermissionGroup>> GetStaffGroupPermissionByStaffId(Guid staffId)
        {
            var staffGroupPermission = dbSet
                .Where(s => s.StaffId == staffId)
                .Include(s => s.PermissionGroup).ThenInclude(g => g.Permissions)
                .ToListAsync();

            return staffGroupPermission;
        }
    }
}
