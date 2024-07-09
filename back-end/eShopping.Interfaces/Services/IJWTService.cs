using eShopping.Common.Models;
using System;
using System.Threading.Tasks;

namespace eShopping.Interfaces
{
    public interface IJWTService
    {
        string GenerateAccessToken(LoggedUserModel user);

        Task<string> GenerateRefreshToken(Guid accountId, string token);

        bool ValidateToken(string token);
    }
}
