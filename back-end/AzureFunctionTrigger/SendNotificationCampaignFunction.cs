using AzureFunctionTrigger.Constants;
using AzureFunctionTrigger.Services.Interfaces;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;
using System;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;

namespace AzureFunctionTrigger
{
    public class SendNotificationCampaignFunction
    {
        private const string TriggerEndpoint = "api/notificationcampaign/trigger-send-notification";

        private readonly ITokenService _tokenService;
        private readonly HttpClient _httpClient;

        public SendNotificationCampaignFunction(ITokenService tokenService, HttpClient httpClient)
        {
            _tokenService = tokenService;
            _httpClient = httpClient;
        }

        [Function("SendNotificationCampaignFunction")]
        public async Task RunAsync([TimerTrigger("0 */5 * * * *")] TimerInfo myTimer, ILogger log)
        {
            if (myTimer.IsPastDue)
            {
                log.LogInformation("Timer is running late!");
            }

            log.LogInformation($"C# SendNotificationCampaignFunction trigger function executed at: {DateTime.Now}");
            var status = await SendingNotificationCampainAsync();
            log.LogInformation($"SendNotificationCampaignFunction status >> {status}");
        }

        private async Task<bool> SendingNotificationCampainAsync()
        {
            var host = Environment.GetEnvironmentVariable(VariableConstants.HOST, EnvironmentVariableTarget.Process);
            var uri = $"{host}/{TriggerEndpoint}";

            var internalToolAccessToken = await _tokenService.GetInternalToolAccessTokenAsync();
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", internalToolAccessToken);

            var response = await _httpClient.PostAsync(uri, null);

            return response.IsSuccessStatusCode;
        }
    }
}