using AzureFunctionTrigger.Constants;
using AzureFunctionTrigger.Services.Interfaces;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;
using System;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;

/// <summary>
/// Update local.setting.json
/// Required: "az login" to authen before fetch-app-settings
/// Power shell: func azure functionapp fetch-app-settings dev-gofnb-CheckBranchesExpirationTime-fnc
/// </summary>
namespace AzureFunctionTrigger
{
    public class ResetAccumulatedPointFunction
    {
        private readonly HttpClient _httpClient;
        private readonly ITokenService _tokenService;

        public ResetAccumulatedPointFunction(HttpClient httpClient, ITokenService tokenService)
        {
            _httpClient = httpClient;
            _tokenService = tokenService;
        }

        [Function("ResetAccumulatedPointFunction")]
        public async Task RunAsync([TimerTrigger("0 0 0 * * *")] TimerInfo myTimer, ILogger log)
        {
            if (myTimer.IsPastDue)
            {
                log.LogInformation("Timer is running late!");
            }
            log.LogInformation($"C# Timer trigger function executed at: {DateTime.UtcNow}");
            var status = await ResetAccumulatedPointAsync();
            log.LogInformation($"ResetAccumulatedPoint status >> {status}");
        }

        private async Task<bool> ResetAccumulatedPointAsync()
        {
            var host = Environment.GetEnvironmentVariable(VariableConstants.HOST, EnvironmentVariableTarget.Process);
            var endpoint = "api/customer/reset-accumulated-point";
            var uri = $"{host}/{endpoint}";

            var internalToolAccessToken = await _tokenService.GetInternalToolAccessTokenAsync();
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", internalToolAccessToken);

            var response = await _httpClient.PostAsync(uri, null);

            return response.IsSuccessStatusCode;
        }
    }
}
