using eShopping.Common.Models.User;
using System.IdentityModel.Tokens.Jwt;

namespace eShopping.Interfaces
{
    public interface IJWTService
    {
        string GenerateAccessToken(LoggedUserModel user);

        JwtSecurityToken ValidateToken(string token);
    }
}
