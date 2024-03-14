using eShopping.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace eShopping.Interfaces.Repositories
{
    public interface IStaffPermissionGroupRepository : IGenericRepository<StaffPermissionGroup>
    {
        Task<List<StaffPermissionGroup>> GetStaffGroupPermissionByStaffId(Guid staffId);

        Task<List<StaffPermissionGroup>> GetStaffGroupPermissionByStaffIds(IEnumerable<Guid> staffIds);
    }
}
