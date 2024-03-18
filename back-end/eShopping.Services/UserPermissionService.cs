using eShopping.Common.Constants;
using eShopping.Common.Extensions;
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
                var claimUserId = claimsPrincipal.Claims.FirstOrDefault(x => x.Type == ClaimTypesConstants.ID);
                var claimAccountType = claimsPrincipal.Claims.FirstOrDefault(x => x.Type == ClaimTypesConstants.ACCOUNT_TYPE);

                var accountId = Guid.Parse(claimAccountId.Value);
                var userId = Guid.Parse(claimUserId.Value);

                if (claimAccountType.Value == EnumAccountType.Customer.GetDescription())
                {
                    var hasPerminssion = requirementPermission.Any(permission => permission == EnumPermission.STORE_WEB);
                    return hasPerminssion;
                }
                else
                {
                    // Get all permission assigned to user and check
                    var permisionGroupIds = _unitOfWork
                        .StaffPermissionGroup
                        .GetAll()
                        .AsNoTracking()
                        .Where(s => s.StaffId == userId)
                        .Include(s => s.PermissionGroup)
                        .Select(g => g.PermissionGroupId)
                        .Distinct();

                    //If user has ADMIN role. No need to check anymore
                    if (permisionGroupIds.ToList().Contains(EnumPermissionGroup.Admin.ToGuid()))
                    {
                        return true;
                    }

                    var hasPerminssion = _unitOfWork
                        .PermissionGroups
                        .Find(g => permisionGroupIds.Any(gpid => gpid == g.Id))
                        .AsNoTracking()
                        .Include(g => g.Permissions)
                        .Select(g => g.Permissions)
                        .AsEnumerable()
                        .Any(listP => listP.Any(permission => requirementPermission.Any(x => x.ToGuid() == permission.Id)));
                    return hasPerminssion;
                }
            }
            catch
            {

            }

            return false;
        }
    }
}
