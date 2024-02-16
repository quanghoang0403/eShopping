using eShopping.Hangfire.Abstractions.Jobs;
using eShopping.Hangfire.Abstractions.Services;
using eShopping.Hangfire.Options;
using eShopping.Hangfire.Shared.Constants;

using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

using System;
using System.Net.Http;

namespace eShopping.Hangfire.Infrastructure.Jobs
{
    public class AutoComfirmOrderJob : IAutoComfirmOrderJob
    {
        public const string JOB_NAME = nameof(AutoComfirmOrderJob);
        private const string JOB_ENDPOINT = "/api/order/auto-comfirm-order";

        private readonly ILogger<CheckBranchesExpirationTimeJob> _logger;
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly GlobalAppSetting _globalAppSetting;
        private readonly IServiceManagement _serviceManagement;

        public AutoComfirmOrderJob(ILogger<CheckBranchesExpirationTimeJob> logger, IHttpClientFactory httpClientFactory, IOptions<GlobalAppSetting> globalAppSettingOpt, IServiceManagement serviceManagement)
        {
            _logger = logger;
            _httpClientFactory = httpClientFactory;
            _globalAppSetting = globalAppSettingOpt.Value;
            _serviceManagement = serviceManagement;
        }

        public void Execute(params object[] args)
        {
            try
            {
                _logger.LogInformation($"{JOB_NAME} - Excuting at {DateTime.Now}");

                using HttpClient httpClient = _httpClientFactory.CreateClient(HttpClientsContants.POS);
                var jobSetting = _globalAppSetting.JobSettings.Find(x => x.JobName.Equals(JOB_NAME));
                var result = httpClient.PostAsync(jobSetting.EndPoint, null).GetAwaiter().GetResult();

                _logger.LogInformation($"{JOB_NAME} - Response >>> {result.StatusCode}");
                _logger.LogInformation($"{JOB_NAME} - Done");
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