using eShopping.Domain.Enums;
using Microsoft.AspNetCore.Authorization;
using System;

namespace eShopping.Common.Attributes.Permission
{
    [AttributeUsage(AttributeTargets.Method | AttributeTargets.Class, Inherited = false)]
    public class HasPermissionAttribute : AuthorizeAttribute
    {
        public HasPermissionAttribute(EnumPermission permission) : base(permission.ToString())
        {
        }
    }
}
