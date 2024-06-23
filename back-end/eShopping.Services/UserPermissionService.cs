using eShopping.Common.Constants;
using eShopping.Common.Extensions;
using eShopping.Domain.Enums;
using eShopping.Interfaces;
using eShopping.MemoryCaching;
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
        private readonly IMemoryCachingService _memoryCachingService;

        public UserPermissionService(IUnitOfWork unitOfWork, IMemoryCachingService memoryCachingService)
        {
            _unitOfWork = unitOfWork;
            _memoryCachingService = memoryCachingService;
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
                    var keyCache = string.Format(KeyCacheConstants.Permission, userId);
                    var permissionIds = _memoryCachingService.GetCache<List<Guid>>(keyCache);
                    if (permissionIds == null)
                    {
                        permissionIds = await _unitOfWork
                            .StaffPermission
                            .GetAll()
                            .AsNoTracking()
                            .Where(s => s.StaffId == userId)
                            .Include(s => s.Permission)
                            .Select(g => g.Permission.Id)
                            .ToListAsync();
                        _memoryCachingService.SetCache(keyCache, permissionIds);
                    }

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
