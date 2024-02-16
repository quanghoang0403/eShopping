using System;
using System.Collections.Generic;
using eShopping.Domain.Entities;
using System.Threading.Tasks;

namespace eShopping.Interfaces.Repositories
{
    public interface IStaffPermissionGroupRepository : IGenericRepository<StaffPermissionGroup>
    {
        Task<List<StaffPermissionGroup>> GetStaffGroupPermissionByStaffId(Guid staffId);
    }
}
