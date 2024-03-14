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
    public class StaffRepository : GenericRepository<Staff>, IStaffRepository
    {
        public StaffRepository(eShoppingDbContext dbContext) : base(dbContext) { }

        public Staff GetStaffByAccountId(Guid accountId)
        {
            var staff = dbSet.Where(s => s.AccountId == accountId).FirstOrDefault();
            return staff;
        }

        public Task<Staff> GetStaffByIdAsync(Guid staffId)
        {
            var staff = dbSet.Include(a => a.Account).FirstOrDefaultAsync(s => s.Id == staffId);
            return staff;
        }

        public Task<Staff> GetStaffByAccountIdAsync(Guid accountId)
        {
            var staff = dbSet.Include(s => s.Account).FirstOrDefaultAsync(s => s.AccountId == accountId);
            return staff;
        }


        public IQueryable<Staff> GetAllStaffByListStaffId(List<Guid?> listStaffId)
        {
            var allStaffs = dbSet.Where(s => listStaffId.Any(Id => Id == s.Id));
            return allStaffs;
        }

        public Task<Staff> GetStaffByIdForEditAsync(Guid staffId)
        {
            var staff = dbSet.Where(s => s.Id == staffId)
                            .Include(s => s.Account)
                            .Include(s => s.StaffPermissionGroups)
                            .ThenInclude(p => p.PermissionGroup)
                            .ThenInclude(p => p.Permissions)
                            .FirstOrDefaultAsync();
            return staff;
        }

    }
}
