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
    public class SendEmailCampaignFunction
    {
        private readonly HttpClient _httpClient;
        private readonly ITokenService _tokenService;

        private struct Payload
        {
            public int Interval { get; set; }

            public Payload(int interval)
            {
                Interval = interval;
            }
        }

        public SendEmailCampaignFunction(HttpClient httpClient, ITokenService tokenService)
        {
            _httpClient = httpClient;
            _tokenService = tokenService;
        }

        [Function("SendEmailCampaignFunction")]
        public async Task RunAsync([TimerTrigger("0 */15 * * * *")] TimerInfo myTimer, ILogger log)
        {
            if (myTimer.IsPastDue)
            {
                log.LogInformation("Timer is running late!");
            }

            log.LogInformation($"C# SendEmailCampaignFunction trigger function executed at: {DateTime.Now}");
            var status = await SendingEmailCampaignAsync();
            log.LogInformation($"SendEmailCampaignFunction status >> {status}");
        }

        private async Task<bool> SendingEmailCampaignAsync()
        {
            var host = Environment.GetEnvironmentVariable(VariableConstants.HOST, EnvironmentVariableTarget.Process);
            var endpoint = "api/emailcampaign/trigger-send-email-campaign";
            var uri = $"{host}/{endpoint}";

            var internalToolAccessToken = await _tokenService.GetInternalToolAccessTokenAsync();
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", internalToolAccessToken);

            var response = await _httpClient.PostAsync(uri, null);

            return response.IsSuccessStatusCode;
        }
    }
}