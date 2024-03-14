using eShopping.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace eShopping.Interfaces.Repositories
{
    public interface IStaffRepository : IGenericRepository<Staff>
    {
        Staff GetStaffByAccountId(Guid accountId);

        Task<Staff> GetStaffByAccountIdAsync(Guid accountId);

        Task<Staff> GetStaffByIdAsync(Guid staffId);

        IQueryable<Staff> GetAllStaffByListStaffId(List<Guid?> listStaffId);

        Task<Staff> GetStaffByIdForEditAsync(Guid staffId);
    }
}
