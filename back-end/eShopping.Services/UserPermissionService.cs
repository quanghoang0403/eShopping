﻿using eShopping.Common.Constants;
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

                //If user has ADMIN role. No need to check anymore
                //if (requirementPermission.Any(permission => permission == EnumPermission.ADMIN)) return true;
                //var requirementGuids = requirementPermission.Select(requirePermission => requirePermission.ToGuid()).ToList();
                //hasPermission = _unitOfWork.Permissions
                //    .Where(permission => requirementGuids.Contains(permission.Id))
                //    .Any();
                //return hasPermission;

                // Get all permission assigned to user and check
                var permisionGroupIds = _unitOfWork
                    .StaffPermissionGroup
                    .GetAll()
                    .AsNoTracking()
                    .Where(s => s.StaffId == staffId)
                    .Include(s => s.PermissionGroup)
                    .Select(g => g.PermissionGroupId)
                    .Distinct();

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
            catch
            {

            }

            return false;
        }
    }
}
