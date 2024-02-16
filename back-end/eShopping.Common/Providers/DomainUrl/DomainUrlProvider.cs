using eShopping.Common.AutoWire;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;

namespace eShopping.Common.Providers
{
    [AutoService(typeof(IDomainUrlProvider), Lifetime = ServiceLifetime.Scoped)]
    public class DomainUrlProvider : IDomainUrlProvider
    {
        private readonly IHttpContextAccessor _httpContextAccessor;

        public DomainUrlProvider(
            IHttpContextAccessor httpContextAccessor
        )
        {
            _httpContextAccessor = httpContextAccessor;
        }


        public string GetCurrentRootDomainFromRequest() => $"{_httpContextAccessor.HttpContext.Request.Scheme}://{_httpContextAccessor.HttpContext.Request.Host}";
    }
}
