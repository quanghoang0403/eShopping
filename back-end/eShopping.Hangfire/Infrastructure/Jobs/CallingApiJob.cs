using eShopping.Hangfire.Abstractions.Jobs;
using eShopping.Hangfire.Shared.Models;

using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;

using Newtonsoft.Json;

using System;
using System.Net.Http;
using System.Text;

namespace eShopping.Hangfire.Infrastructure.Jobs
{
    public class CallingApiJob : ICallingApiJob
    {
        private readonly ILogger<CallingApiJob> _logger;
        private readonly IHttpClientFactory _httpClientFactory;

        public CallingApiJob(ILogger<CallingApiJob> logger, IHttpClientFactory httpClientFactory)
        {
            _logger = logger;
            _httpClientFactory = httpClientFactory;
        }

        public void Execute(JobMetadata metadata)
        {
            try
            {
                if (string.IsNullOrEmpty(metadata.Client))
                {
                    using var httpClient = new HttpClient();
                    var uri = new Uri(metadata.Endpoint);
                    httpClient.BaseAddress = new Uri(uri.GetLeftPart(System.UriPartial.Authority));

                    if (metadata.Method == HttpMethods.Get)
                    {
                        var response = httpClient.GetAsync(uri.PathAndQuery).GetAwaiter().GetResult();
                        _logger.LogInformation("RESPONSE: " + response.Content);
                    }
                    if (metadata.Method == HttpMethods.Post)
                    {
                        var jsonPayload = JsonConvert.SerializeObject(metadata.Payload);
                        var stringContent = new StringContent(jsonPayload, UnicodeEncoding.UTF8, "application/json");
                        var response = httpClient.PostAsync(uri.PathAndQuery, stringContent, default).GetAwaiter().GetResult();
                        _logger.LogInformation("RESPONSE: " + response.Content);
                    }
                }
                else
                {
                    using var httpClient = _httpClientFactory.CreateClient(metadata.Client);
                    if (metadata.Method == HttpMethods.Get)
                    {
                        var response = httpClient.GetAsync(metadata.Endpoint).GetAwaiter().GetResult();
                        _logger.LogInformation("RESPONSE: " + response.Content);
                    }

                    if (metadata.Method == HttpMethods.Post)
                    {
                        var jsonPayload = JsonConvert.SerializeObject(metadata.Payload);
                        var stringContent = new StringContent(jsonPayload, UnicodeEncoding.UTF8, "application/json");
                        var response = httpClient.PostAsync(metadata.Endpoint, stringContent, default).GetAwaiter().GetResult();
                        _logger.LogInformation("RESPONSE: " + response.Content);
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                throw new Exception(ex.Message, ex);
            }
        }
    }
}