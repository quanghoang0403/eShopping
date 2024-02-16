using eShopping.Domain.Entities;
using eShopping.Infrastructure.Contexts;
using eShopping.Interfaces.Repositories;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace eShopping.Infrastructure.Repositories
{
    public class StaffRepository : GenericRepository<Staff>, IStaffRepository
    {
        public StaffRepository(eShoppingDbContext dbContext) : base(dbContext) { }


        public async Task<List<Staff>> GetAllStaffsAsync()
        {
            var staffs = await dbSet.Where(u => !u.IsDeleted).ToListAsync();
            return staffs;
        }
    }
}
