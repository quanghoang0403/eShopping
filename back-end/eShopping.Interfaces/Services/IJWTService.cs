using eShopping.Common.Models.User;
using System;
using System.Threading.Tasks;

namespace eShopping.Interfaces
{
    public interface IJWTService
    {
        string GenerateAccessToken(LoggedUserModel user);

        Task<string> GenerateRefreshToken(Guid accountId);

        bool ValidateToken(string token);
    }
}
