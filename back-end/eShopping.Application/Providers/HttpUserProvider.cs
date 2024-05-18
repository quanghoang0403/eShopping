using eShopping.Common.Constants;
using eShopping.Common.Exceptions;
using eShopping.Common.Extensions;
using eShopping.Common.Models;
using eShopping.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Threading;
using System.Threading.Tasks;

namespace eShopping.Application.Providers
{
    public class HttpUserProvider : IUserProvider
    {
        private readonly ILogger<HttpUserProvider> _logger;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public HttpUserProvider(
            ILogger<HttpUserProvider> logger,
            IHttpContextAccessor httpContextAccessor
        )
        {
            _logger = logger;
            _httpContextAccessor = httpContextAccessor;
        }

        public Task<LoggedUserModel> ProvideAsync(CancellationToken cancellationToken = default)
        {
            var identifier = GetLoggedUserModelFromJwt(_httpContextAccessor.HttpContext.User);
            if (identifier == null)
            {
                _logger.LogWarning("object identifier is null for the user");
                throw new UnauthorisedException();
            }

            return Task.FromResult(identifier);
        }

        public LoggedUserModel Provide()
        {
            var identifier = GetLoggedUserModelFromJwt(_httpContextAccessor.HttpContext.User);
            if (identifier == null)
            {
                _logger.LogWarning("object identifier is null for the user");
                throw new UnauthorisedException();
            }

            return identifier;
        }

        public LoggedUserModel GetLoggedUserModelFromJwt(string token)
        {
            var handler = new JwtSecurityTokenHandler();
            var jwtSecurityToken = handler.ReadJwtToken(token);

            var id = jwtSecurityToken.Claims.FirstOrDefault(x => x.Type == ClaimTypesConstants.ID);
            var accountId = jwtSecurityToken.Claims.FirstOrDefault(x => x.Type == ClaimTypesConstants.ACCOUNT_ID);
            var fullName = jwtSecurityToken.Claims.FirstOrDefault(x => x.Type == ClaimTypesConstants.FULL_NAME);
            var email = jwtSecurityToken.Claims.FirstOrDefault(x => x.Type == ClaimTypesConstants.EMAIL);
            var phoneNumber = jwtSecurityToken.Claims.FirstOrDefault(x => x.Type == ClaimTypesConstants.PHONE_NUMBER);

            if (id == null)
            {
                return null;
            }

            var loggedUser = new LoggedUserModel()
            {
                Id = id.Value.ToGuid(),
                AccountId = accountId.Value.ToGuid(),
                FullName = fullName?.Value,
                Email = email?.Value,
                PhoneNumber = phoneNumber?.Value,
            };

            return loggedUser;
        }

        private static LoggedUserModel GetLoggedUserModelFromJwt(ClaimsPrincipal claimsPrincipal)
        {
            var id = claimsPrincipal.Claims.FirstOrDefault(x => x.Type == ClaimTypesConstants.ID);
            var accountId = claimsPrincipal.Claims.FirstOrDefault(x => x.Type == ClaimTypesConstants.ACCOUNT_ID);
            var fullName = claimsPrincipal.Claims.FirstOrDefault(x => x.Type == ClaimTypesConstants.FULL_NAME);
            var email = claimsPrincipal.Claims.FirstOrDefault(x => x.Type == ClaimTypesConstants.EMAIL);
            var phoneNumber = claimsPrincipal.Claims.FirstOrDefault(x => x.Type == ClaimTypesConstants.PHONE_NUMBER);

            if (id == null)
            {
                return null;
            }

            var loggedUser = new LoggedUserModel()
            {
                Id = id.Value.ToGuid(),
                AccountId = accountId.Value.ToGuid(),
                FullName = fullName?.Value,
                Email = email?.Value,
                PhoneNumber = phoneNumber?.Value,
            };

            return loggedUser;
        }
    }
}
