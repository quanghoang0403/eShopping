using System.Threading.Tasks;

namespace eShopping.Hangfire.Abstractions.Services
{
    public interface ITokenService
    {
        Task<string> GetInternalToolAccessTokenAsync();
    }
}