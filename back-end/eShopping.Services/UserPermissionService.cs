using eShopping.Common.Constants;
using eShopping.Domain.Enums;
using eShopping.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace eShopping.Services.User
{
    public class UserPermissionService : IUserPermissionService
    {
        private readonly IUnitOfWork _unitOfWork;

        public UserPermissionService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<bool> CheckPermissionForUserAsync(ClaimsPrincipal claimsPrincipal, IEnumerable<EnumPermission> requirementPermission)
        {
            try
            {
                var claimAccountId = claimsPrincipal.Claims.FirstOrDefault(x => x.Type == ClaimTypesConstants.ACCOUNT_ID);
                var claimStaffId = claimsPrincipal.Claims.FirstOrDefault(x => x.Type == ClaimTypesConstants.ID);

                var accountId = Guid.Parse(claimAccountId.Value);
                var staffId = Guid.Parse(claimStaffId.Value);

                // Get all permission assigned to user and check
                var permisionGroupIds = _unitOfWork
                    .StaffPermissionGroup
                    .GetAll()
                    .AsNoTracking()
                    .Where(s => s.StaffId == staffId)
                    .Include(s => s.PermissionGroup)
                    .Select(g => g.PermissionGroupId)
                    .Distinct();
                var hasPerminssion = _unitOfWork
                    .PermissionGroups
                    .Find(g => permisionGroupIds.Any(gpid => gpid == g.Id))
                    .AsNoTracking()
                    .Include(g => g.Permissions)
                    .SelectMany(g => g.Permissions)
                    .Any(permission => requirementPermission.Any(x => x.ToGuid() == permission.Id));

                return hasPerminssion;
            }
            catch
            {

            }

            return false;
        }
    }
}
