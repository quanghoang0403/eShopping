using eShopping.Hangfire.Abstractions.Services;
using eShopping.Hangfire.Infrastructure.Jobs;
using eShopping.Hangfire.Options;
using eShopping.Hangfire.Shared.Constants;
using eShopping.Hangfire.Shared.Models;

using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

using Newtonsoft.Json;

using System;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text;
using System.Threading.Tasks;

namespace eShopping.Hangfire.Infrastructure.Services
{
    public class TokenService : ITokenService
    {
        private readonly ILogger<CheckBranchesExpirationTimeJob> _logger;
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly GlobalAppSetting _globalAppSetting;

        public TokenService(ILogger<CheckBranchesExpirationTimeJob> logger, IHttpClientFactory httpClientFactory, IOptions<GlobalAppSetting> globalSettingOpt)
        {
            _logger = logger;
            _httpClientFactory = httpClientFactory;
            _globalAppSetting = globalSettingOpt.Value;
        }

        public async Task<string> GetInternalToolAccessTokenAsync()
        {
            try
            {
                var internalAuthenticateModel = new InternalAuthenticateRequest()
                {
                    UserName = _globalAppSetting.InternalAuthenticate.Username,
                    Password = _globalAppSetting.InternalAuthenticate.Password,
                };

                using HttpClient httpClient = _httpClientFactory.CreateClient(HttpClientsContants.ADMIN);
                var internalAuthenEnpoint = "/api/login/internal-tool";

                var httpContent = new StringContent(JsonConvert.SerializeObject(internalAuthenticateModel), Encoding.UTF8);
                httpContent.Headers.ContentType = new MediaTypeHeaderValue("application/json");

                var result = httpClient.PostAsync(internalAuthenEnpoint, httpContent).GetAwaiter().GetResult();

                var responseContent = await result.Content.ReadFromJsonAsync<InternalAuthenticateResponse>();

                return responseContent.Token;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ex.Message);
                throw;
            }
            finally
            {
                GC.SuppressFinalize(this);
            }
        }
    }
}