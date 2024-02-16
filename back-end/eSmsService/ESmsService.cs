using eSmsService.Models.Requests;
using eSmsService.Models.Responses;

using eShopping.Domain.Settings;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using System.Web;

namespace eSmsService
{
    public class ESmsService : IESmsService
    {
        private const string GetAccountBalanceEndpoint = "GetBalance_json";
        private const string SendMultipleMessageEndpoint = "SendMultipleMessage_V4_post_json";
        private const string SendMultipleSMSBrandnameEndpoint = "SendMultipleSMSBrandname_json";

        private const string GetSmsSentDataV1Endpoint = "GetSmsSentData_V1";
        private const string GetSendStatusEndpoint = "GetSendStatus";
        private const string GetSmsReceiverStatusEndpoint = "GetSmsReceiverStatus_get";
        private const string GetListBrandnameEndpoint = "GetListBrandname";
        private const string GetTemplateEndpoint = "GetTemplate";
        private const string SummaryMultipleMessageV4Endpoint = "SummaryMultipleMessage_V4_get";

        //Zalo
        private const string GetListZOAEndpoint = "ZNS/GetListZOA";
        private const string GetSummaryZaloMessageV4Endpoint = "SummaryZaloMessage_V4_post_json";
        private const string GetQuotaEndpoint = "ZNS/GetQuota";
        private const string GetRatingEndpoint = "ZNS/GetRating";
        private const string GetCallbackEndpoint = "http://status-sms.esms.vn/ZaloCallback/GetCallback";

        private readonly string _hostJSON;

        public ESmsService(IOptions<AppSettings> appSettingOpt)
        {
            _hostJSON = appSettingOpt.Value.ESmsSettings.HostJSON;
        }

        public static async Task<string> GetDataToHttpRequestAsync(object request, string url, HttpMethod method, string payload = "", string mediaType = "application/json")
        {
            using var httpClient = new HttpClient();
            HttpRequestMessage httpRequest;
            if (string.IsNullOrEmpty(payload))
            {
                httpRequest = new HttpRequestMessage(method, url)
                {
                    Content = new StringContent(System.Text.Json.JsonSerializer.Serialize(request), Encoding.UTF8, mediaType)
                };
            }
            else
            {
                httpRequest = new HttpRequestMessage(method, url)
                {
                    Content = new StringContent(payload, Encoding.UTF8, mediaType)
                };
            }

            var resposne = await httpClient.SendAsync(httpRequest);
            if (resposne.IsSuccessStatusCode)
            {
                var responseData = await resposne.Content.ReadAsStringAsync();
                return responseData;
            }
            return null;
        }

        public async Task<bool> IsValidApiSecretKey(string apiKey, string secretKey)
        {
            var resposne = await GetAccountBalanceAsync(new GetAccountBalanceRequest(apiKey, secretKey));
            return resposne.IsValidApiSecretKey;
        }

        public async Task<AccountBalance> GetAccountBalanceAsync(GetAccountBalanceRequest request)
        {
            var url = $"{_hostJSON}/{GetAccountBalanceEndpoint}";
            var result = await GetDataToHttpRequestAsync(request, url, HttpMethod.Post);
            if (!string.IsNullOrEmpty(result))
            {
                return System.Text.Json.JsonSerializer.Deserialize<AccountBalance>(result);
            }
            return null;
        }


        public async Task<SendSmsResponse> SendSMSAsync(SendSmsBaseRequest request)
        {
            string endpoint = request switch
            {
                SendSmsCSKHRequest or SendSmsFixedNumberRequest => SendMultipleMessageEndpoint,
                _ => SendMultipleSMSBrandnameEndpoint,
            };

            var url = $"{_hostJSON}/{endpoint}";
            var result = await GetDataToHttpRequestAsync(request, url, HttpMethod.Post);
            if (!string.IsNullOrEmpty(result))
            {
                return System.Text.Json.JsonSerializer.Deserialize<SendSmsResponse>(result);
            }
            return null;
        }

        public async Task<GetSmsSentDataResponse> GetSmsSentDataAsync(GetSmsSentDataRequest request)
        {
            var fromDate = request.From != DateTime.MinValue ? request.From.ToString("yyyy/MM/dd") : DateTime.Now.ToString("yyyy/MM/dd");
            var toDate = request.To != DateTime.MinValue ? request.To.ToString("yyyy/MM/dd") : DateTime.Now.ToString("yyyy/MM/dd");
            var payload = @"<RQST>"
                   + "<APIKEY>" + request.ApiKey + "</APIKEY>"
                   + "<SECRETKEY>" + request.SecretKey + "</SECRETKEY>"
                   + "<FROM>" + fromDate + "</FROM>"
                   + "<TO>" + toDate + "</TO>"
                   + "</RQST>";
            var url = $"{_hostJSON}/{GetSmsSentDataV1Endpoint}";
            var result = await GetDataToHttpRequestAsync(request, url, HttpMethod.Post, payload:payload, mediaType:"text/plain");
            if (!string.IsNullOrEmpty(result))
            {
                return System.Text.Json.JsonSerializer.Deserialize<GetSmsSentDataResponse>(result);
            }
            return null;
        }

        public async Task<GetSendStatusResponse> GetSendStatusAsync(GetSmsDetailByIdRequest request)
        {
            var queryString = new Dictionary<string, string>()
            {
                ["ApiKey"] = request.ApiKey,
                ["SecretKey"] = request.SecretKey,
                ["RefId"] = request.RefId,
            };

            var url = QueryHelpers.AddQueryString($"{_hostJSON}/{GetSendStatusEndpoint}", queryString);
            var result = await GetDataToHttpRequestAsync(request, url, HttpMethod.Get);
            if (!string.IsNullOrEmpty(result))
            {
                return System.Text.Json.JsonSerializer.Deserialize<GetSendStatusResponse>(result);
            }
            return null;
        }

        public async Task<GetSmsReceiverByIdResponse> GetSmsReceiverStatusAsync(GetSmsReceiverStatusRequest request)
        {
            var queryString = new Dictionary<string, string>()
            {
                ["ApiKey"] = request.ApiKey,
                ["SecretKey"] = request.SecretKey,
                ["RefId"] = request.RefId,
            };

            var url = QueryHelpers.AddQueryString($"{_hostJSON}/{GetSmsReceiverStatusEndpoint}", queryString);
            var result = await GetDataToHttpRequestAsync(request, url, HttpMethod.Get);
            if (!string.IsNullOrEmpty(result))
            {
                return System.Text.Json.JsonSerializer.Deserialize<GetSmsReceiverByIdResponse>(result);
            }
            return null;
        }

        public async Task<GetListBrandnameResponse> GetListBrandnameAsync(GetListBrandnameRequest request)
        {
            var url = $"{_hostJSON}/{GetListBrandnameEndpoint}/{request.ApiKey}/{request.SecretKey}";
            var result = await GetDataToHttpRequestAsync(request, url, HttpMethod.Get);
            if (!string.IsNullOrEmpty(result))
            {
                return System.Text.Json.JsonSerializer.Deserialize<GetListBrandnameResponse>(result);
            }
            return null;
        }

        public async Task<GetBrandnameTemplatesResponse> GetTemplateAsync(GetTemplateRequest request)
        {
            var url = $"{_hostJSON}/{GetTemplateEndpoint}";
            var result = await GetDataToHttpRequestAsync(request, url, HttpMethod.Post);
            if (!string.IsNullOrEmpty(result))
            {
                return System.Text.Json.JsonSerializer.Deserialize<GetBrandnameTemplatesResponse>(result);
            }
            return null;
        }

        public async Task<GetSummaryMultipleMessageResponse> GetSummaryMultipleMessageAsync(GetSummaryMultipleMessageRequest request)
        {
            var queryString = new Dictionary<string, string>()
            {
                ["ApiKey"] = request.ApiKey,
                ["SecretKey"] = request.SecretKey,
                ["Brandname"] = request.Brandname,
                ["SmsType"] = request.SmsType,
                ["Phone"] = request.Phone,
                ["Content"] = request.Content,
            };

            var url = QueryHelpers.AddQueryString($"{_hostJSON}/{SummaryMultipleMessageV4Endpoint}", queryString);
            var result = await GetDataToHttpRequestAsync(request, HttpUtility.UrlDecode(url), HttpMethod.Get);
            if (!string.IsNullOrEmpty(result))
            {
                return System.Text.Json.JsonSerializer.Deserialize<GetSummaryMultipleMessageResponse>(result);
            }
            return null;
        }

        public async Task<GetListZoaResponse> GetListZoaAsync(GetListZoaRequest request)
        {
            var url = $"{_hostJSON}/{GetListZOAEndpoint}";
            var result = await GetDataToHttpRequestAsync(request, url, HttpMethod.Post);
            if (!string.IsNullOrEmpty(result))
            {
                return System.Text.Json.JsonSerializer.Deserialize<GetListZoaResponse>(result);
            }
            return null;
        }

        public async Task<GetZoaTemplateResponse> GetZoaTemplateAsync(GetZoaTemplateRequest request)
        {
            var url = $"{_hostJSON}/{GetTemplateEndpoint}";
            var result = await GetDataToHttpRequestAsync(request, url, HttpMethod.Post);
            if (!string.IsNullOrEmpty(result))
            {
                return System.Text.Json.JsonSerializer.Deserialize<GetZoaTemplateResponse>(result);
            }
            return null;
        }

        public async Task<GetSummaryZaloMessageResponse> GetSummaryZaloMessageAsync(GetSummaryZaloMessageRequest request)
        {
            var url = $"{_hostJSON}/{GetSummaryZaloMessageV4Endpoint}";
            var result = await GetDataToHttpRequestAsync(request, url, HttpMethod.Post);
            if (!string.IsNullOrEmpty(result))
            {
                return System.Text.Json.JsonSerializer.Deserialize<GetSummaryZaloMessageResponse>(result);
            }
            return null;
        }

        public async Task<GetQuotaResponse> GetQuotaAsync(GetQuotaRequest request)
        {
            var url = $"{_hostJSON}/{GetQuotaEndpoint}";
            var result = await GetDataToHttpRequestAsync(request, url, HttpMethod.Post);
            if (!string.IsNullOrEmpty(result))
            {
                return System.Text.Json.JsonSerializer.Deserialize<GetQuotaResponse>(result);
            }
            return null;
        }

        public async Task<GetRatingResponse> GetRatingAsync(GetRatingRequest request)
        {
            var url = $"{_hostJSON}/{GetRatingEndpoint}";
            var result = await GetDataToHttpRequestAsync(request, url, HttpMethod.Post);
            if (!string.IsNullOrEmpty(result))
            {
                return System.Text.Json.JsonSerializer.Deserialize<GetRatingResponse>(result);
            }
            return null;
        }

        public async Task<GetCallbackResponse> GetCallbackAsync(GetCallbackRequest request)
        {
            var url = $"{_hostJSON}/{GetCallbackEndpoint}";
            var result = await GetDataToHttpRequestAsync(request, url, HttpMethod.Post);
            if (!string.IsNullOrEmpty(result))
            {
                return System.Text.Json.JsonSerializer.Deserialize<GetCallbackResponse>(result);
            }
            return null;
        }
    }
}