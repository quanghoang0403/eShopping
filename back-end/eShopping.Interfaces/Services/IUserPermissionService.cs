using eShopping.Domain.Enums;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;

namespace eShopping.Interfaces
{
    public interface IUserPermissionService
    {
        Task<bool> CheckPermissionForUserAsync(ClaimsPrincipal claimsPrincipal, IEnumerable<EnumPermission> requirementPermission);
    }
}
