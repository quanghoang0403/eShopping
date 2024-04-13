using eShopping.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace eShopping.Interfaces.Repositories
{
    public interface IStaffPermissionRepository : IGenericRepository<StaffPermission>
    {
        Task<List<StaffPermission>> GetStaffPermissionsByStaffId(Guid staffId);

        Task<List<StaffPermission>> GetStaffPermissionsByStaffIds(IEnumerable<Guid> staffIds);
    }
}
