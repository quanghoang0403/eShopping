using eShopping.Common.Constants;
using eShopping.Common.Exceptions;
using eShopping.Common.Extensions;
using eShopping.Common.Models.User;
using eShopping.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Threading;
using System.Threading.Tasks;

namespace eShopping.Application.Store.Providers
{
    public class HttpUserProvider : IUserProvider
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly ILogger<HttpUserProvider> _logger;

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

        private static LoggedUserModel GetLoggedUserModelFromJwt(ClaimsPrincipal claimsPrincipal)
        {
            var claimId = claimsPrincipal.Claims.FirstOrDefault(x => x.Type == ClaimTypesConstants.ID);
            var claimAccountId = claimsPrincipal.Claims.FirstOrDefault(x => x.Type == ClaimTypesConstants.ACCOUNT_ID);
            var claimFullName = claimsPrincipal.Claims.FirstOrDefault(x => x.Type == ClaimTypesConstants.FULL_NAME);
            var claimEmail = claimsPrincipal.Claims.FirstOrDefault(x => x.Type == ClaimTypesConstants.EMAIL);

            if (claimId == null)
            {
                return null;
            }

            var fullName = claimFullName == null ? "" : claimFullName.Value;
            var email = claimEmail == null ? "" : claimEmail.Value;
            var loggedUser = new LoggedUserModel()
            {
                Id = claimId.Value.ToGuid(),
                AccountId = claimAccountId.Value.ToGuid(),
                FullName = fullName,
                Email = email
            };

            return loggedUser;
        }

        public LoggedUserModel GetLoggedUserModelFromJwt(string token)
        {
            var handler = new JwtSecurityTokenHandler();
            var jwtSecurityToken = handler.ReadJwtToken(token);

            var id = jwtSecurityToken.Claims.FirstOrDefault(x => x.Type == ClaimTypesConstants.ID);
            var accountId = jwtSecurityToken.Claims.FirstOrDefault(x => x.Type == ClaimTypesConstants.ACCOUNT_ID);
            var fullName = jwtSecurityToken.Claims.FirstOrDefault(x => x.Type == ClaimTypesConstants.FULL_NAME);
            var email = jwtSecurityToken.Claims.FirstOrDefault(x => x.Type == ClaimTypesConstants.EMAIL);

            if (id == null)
            {
                return null;
            }

            var loggedUser = new LoggedUserModel()
            {
                Id = id.Value.ToGuid(),
                AccountId = accountId.Value.ToGuid(),
                FullName = fullName.Value,
                Email = email?.Value,
            };

            return loggedUser;
        }
    }
}
