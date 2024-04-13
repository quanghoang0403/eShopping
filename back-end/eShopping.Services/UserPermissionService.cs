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
                    var permissionIds = _unitOfWork
                        .StaffPermission
                        .GetAll()
                        .AsNoTracking()
                        .Where(s => s.StaffId == userId)
                        .Include(s => s.Permission)
                        .Select(g => g.Permission.Id)
                        .ToList();

                    //If user has ADMIN role. No need to check anymore
                    if (permissionIds.Contains(EnumPermission.ADMIN.ToGuid()))
                    {
                        return true;
                    }

                    var hasPerminssion = permissionIds.Any(permissionId => requirementPermission.Any(x => x.ToGuid() == permissionId));
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
