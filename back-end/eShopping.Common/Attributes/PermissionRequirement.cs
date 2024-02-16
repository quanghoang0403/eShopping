using eShopping.Domain.Enums;
using Microsoft.AspNetCore.Authorization;
using System.Collections.Generic;

namespace eShopping.Common.Attributes.Permission
{
    public class PermissionRequirement : IAuthorizationRequirement
    {
        public PermissionRequirement(IEnumerable<EnumPermission> permissions)
        {
            Permissions = permissions;
        }

        public IEnumerable<EnumPermission> Permissions { get; }
    }
}
