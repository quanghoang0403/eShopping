using eShopping.Hangfire.Abstractions.Services;
using eShopping.Hangfire.Infrastructure.Jobs;
using eShopping.Hangfire.Options;

using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

using System;
using System.Net.Http;

namespace eShopping.Hangfire.Infrastructure.Services
{
    public class ServiceManagement : IServiceManagement
    {
        private readonly Lazy<ITokenService> _tokenService;

        public ServiceManagement(ILogger<CheckBranchesExpirationTimeJob> logger, IHttpClientFactory httpClientFactory, IOptions<GlobalAppSetting> globalAppSettingOpt)
        {
            _tokenService = new Lazy<ITokenService>(() => new TokenService(logger, httpClientFactory, globalAppSettingOpt));
        }

        public ITokenService TokenService => _tokenService.Value;
    }
}