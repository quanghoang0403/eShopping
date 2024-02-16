using eShopping.Common.Extensions;
using eShopping.Common.Models.User;
using eShopping.Domain.Settings;
using eShopping.Interfaces;
using eShopping.Models.Admin.Payment;
using eShopping.Payment.MoMo.Enums;
using eShopping.Payment.MoMo.Model;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace eShopping.Payment.MoMo
{
    /// <summary>
    /// Payment services integrate with momo api
    /// </summary>
    public class MoMoPaymentService : IMoMoPaymentService
    {
        private readonly AppSettings _appSettings;
        private readonly MoMoSettings _momoSettings;
        private readonly HttpClient _httpClient;

        public MoMoPaymentService(
            IOptions<AppSettings> appSettings,
            HttpClient httpClient)
        {
            _appSettings = appSettings.Value;
            _momoSettings = _appSettings.PaymentSettings.MoMoSettings;
            _httpClient = httpClient;
        }

        public Task<CreateGetwayResponseModel> CreateGatewayTestingAsync(PartnerMoMoPaymentConfigModel config, CreateGetwayRequestModel request)
        {
            string endpoint = $"{_momoSettings.DomainProduction}/v2/gateway/api/create";

            /// Momo Configs
            string SecretKey = config.SecretKey;
            string partnerCode = config.PartnerCode;
            string accessKey = config.AccessKey;

            /// Request data
            string requestId = request.RequestId;
            string amount = request.Amount;
            string extraData = request.ExtraData;
            string orderId = request.OrderId;
            string orderInfo = request.OrderInfo;
            string partnerClientId = request.PartnerClientId;
            string redirectUrl = request.RedirectUrl;
            string ipnUrl = request.IpnUrl;
            var language = request.Language ?? "vi";

            string rawHash = $"accessKey={accessKey}&" +
                $"amount={amount}&" +
                $"extraData={extraData}&" +
                $"ipnUrl={ipnUrl}&" +
                $"orderId={orderId}&" +
                $"orderInfo={orderInfo}&" +
                $"partnerClientId={partnerClientId}&" +
                $"partnerCode={partnerCode}&" +
                $"redirectUrl={redirectUrl}&" +
                $"requestId={requestId}&" +
                $"requestType=linkWallet";

            var momoSecurity = new MoMoSecurity();
            string signature = momoSecurity.SignSHA256(rawHash, SecretKey);
            var requestData = new JObject
            {
                { "partnerCode", partnerCode },
                { "accessKey", accessKey },
                { "requestId", requestId },
                { "amount", amount },
                { "extraData", extraData },
                { "orderId", orderId },
                { "orderInfo", orderInfo },
                { "ipnUrl", ipnUrl },
                { "redirectUrl", redirectUrl },
                { "partnerClientId", partnerClientId },
                { "requestType", "linkWallet" },
                { "lang", language },
                { "signature", signature },
            };

            var responseFromMomo = MoMoPaymentRequest.SendPaymentRequest(endpoint, requestData.ToString());
            var createGetwayResponseModel = JsonConvert.DeserializeObject<CreateGetwayResponseModel>(responseFromMomo.Data);
            return Task.FromResult(createGetwayResponseModel);
        }

        public Task<CreateGetwayResponseModel> CreateGatewayAsync(PartnerMoMoPaymentConfigModel config, CreateGetwayRequestModel request, string requestType)
        {
            string endpoint = $"{_momoSettings.DomainProduction}/v2/gateway/api/create";
            /// Momo Configs
            string SecretKey = config.SecretKey;
            string partnerCode = config.PartnerCode;
            string accessKey = config.AccessKey;

            /// Request data
            string requestId = request.RequestId;
            string amount = request.Amount;
            string extraData = request.ExtraData;
            string orderId = request.OrderId;
            string orderInfo = request.OrderInfo;
            string partnerClientId = request.PartnerClientId;
            string redirectUrl = request.RedirectUrl;
            string ipnUrl = request.IpnUrl;
            var language = request.Language ?? "vi";

            string rawHash = $"accessKey={accessKey}&" +
                $"amount={amount}&" +
                $"extraData={extraData}&" +
                $"ipnUrl={ipnUrl}&" +
                $"orderId={orderId}&" +
                $"orderInfo={orderInfo}&" +
                $"partnerClientId={partnerClientId}&" +
                $"partnerCode={partnerCode}&" +
                $"redirectUrl={redirectUrl}&" +
                $"requestId={requestId}&" +
                $"requestType={requestType}";

            if (requestType.Equals(RequestTypes.CaptureWallet))
            {
                rawHash = $"accessKey={accessKey}&" +
                $"amount={amount}&" +
                $"extraData={extraData}&" +
                $"ipnUrl={ipnUrl}&" +
                $"orderId={orderId}&" +
                $"orderInfo={orderInfo}&" +
                $"partnerCode={partnerCode}&" +
                $"redirectUrl={redirectUrl}&" +
                $"requestId={requestId}&" +
                $"requestType={requestType}";
            }

            var momoSecurity = new MoMoSecurity();
            string signature = momoSecurity.SignSHA256(rawHash, SecretKey);
            var requestData = new JObject
            {
                { "partnerCode", partnerCode },
                { "accessKey", accessKey },
                { "requestId", requestId },
                { "amount", amount },
                { "extraData", extraData },
                { "orderId", orderId },
                { "orderInfo", orderInfo },
                { "ipnUrl", ipnUrl },
                { "redirectUrl", redirectUrl },
                { "partnerClientId", partnerClientId },
                { "requestType", requestType },
                { "lang", language },
                { "signature", signature },
            };

            if (requestType.Equals(RequestTypes.CaptureWallet))
            {
                requestData = new JObject
                {
                    { "partnerCode", partnerCode },
                    { "accessKey", accessKey },
                    { "requestId", requestId },
                    { "amount", amount },
                    { "extraData", extraData },
                    { "orderId", orderId },
                    { "orderInfo", orderInfo },
                    { "ipnUrl", ipnUrl },
                    { "redirectUrl", redirectUrl },
                    { "requestType", requestType },
                    { "lang", language },
                    { "signature", signature },
                };
            }

            var responseFromMomo = MoMoPaymentRequest.SendPaymentRequest(endpoint, requestData.ToString());
            if (!responseFromMomo.Success)
            {
                var result = new CreateGetwayResponseModel
                {
                    Message = responseFromMomo.Message,
                    ResultCode = responseFromMomo.ResultCode,
                };

                return Task.FromResult(result);
            }

            var createGetwayResponseModel = JsonConvert.DeserializeObject<CreateGetwayResponseModel>(responseFromMomo.Data);
            return Task.FromResult(createGetwayResponseModel);
        }

        /// <summary>
        /// Using pay pos v2
        /// docs: https://developers.momo.vn/v3/vi/docs/payment/api/quick-pay-v2/
        /// </summary>
        /// <param name="config"></param>
        /// <param name="request"></param>
        /// <returns></returns>
        public async Task<MomoWrapperResponse<MomoPaymentResponse>> CreatePosGatewayAsync(PartnerMoMoPaymentConfigModel config, CreatePosGatewayRequest request)
        {
            string endpoint = $"{_momoSettings.DomainProduction}/v2/gateway/api/pos";
            var momoSecurity = new MoMoSecurity();
            string extraData = momoSecurity.Base64Encode(request.ExtraData);

            // momo public key from
            // https://business.momo.vn/merchant/integrateQRAIAInfo
            var publicKey = config.PublicKey;
            var rsaPublicKey = publicKey.ConvertPublicKeyToXmlString();
            string paymentCodeEnscrypted = momoSecurity.RSAEncryption(request.PaymentCode, rsaPublicKey);
            var rawSignature =
                "accessKey=" + config.AccessKey +
                "&amount=" + request.Amount +
                "&extraData=" + extraData +
                "&orderId=" + request.OrderId +
                "&orderInfo=" + request.OrderInfo +
                "&partnerCode=" + request.PartnerCode +
                "&paymentCode=" + paymentCodeEnscrypted +
                "&requestId=" + request.RequestId;

            string signature = momoSecurity.SignSHA256(rawSignature, config.SecretKey);
            var quickPayResquest = new QuickPayRequest
            {
                PartnerCode = config.PartnerCode,
                OrderId = request.OrderId,
                Amount = request.Amount,
                RequestId = request.RequestId,
                PaymentCode = paymentCodeEnscrypted,
                OrderInfo = request.OrderInfo,
                ExtraData = extraData,
                Lang = request.Lang,
                Signature = signature,
                /// ipnUrl, request.IpnUrl },
                ///{ "storeId", "" }, /// optional
                ///{ "storeName", "" }, /// optional
                ///{ "orderGroupId", "" }, /// optional
                ///{ "autoCapture", "" }, /// optional
                ///{ "items", "" }, /// optional
                ///{ "userInfo", "" }, /// optional
            };

            var response = new MomoWrapperResponse<MomoPaymentResponse>();
            var requesrData = quickPayResquest.ToJsonWithCamelCase();
            var httpContent = new StringContent(requesrData, Encoding.UTF8, "application/json");
            try
            {
                HttpResponseMessage httpResponseMessage = await _httpClient.PostAsync(endpoint, httpContent);
                var responseMessage = await httpResponseMessage.Content.ReadAsStringAsync();
                var momoResponse = JsonConvert.DeserializeObject<MomoPaymentResponse>(responseMessage);

                if (httpResponseMessage.IsSuccessStatusCode)
                {
                    /// resultcode: https://developers.momo.vn/v3/vi/docs/payment/api/result-handling/resultcode
                    response.Data = momoResponse;
                    if (momoResponse.ResultCode == MomoResponseCode.PAYMENT_SUCCESS || momoResponse.ResultCode == MomoResponseCode.PAYMENT_POS_SUCCESS)
                    {
                        response.Success = true;
                    }
                    else
                    {
                        response.Message = momoResponse.Message;
                    }
                }
                else
                {
                    response.Success = false;
                    response.Message = momoResponse.Message;
                    response.ResultCode = momoResponse.ResultCode;
                }
            }
            catch (Exception ex)
            {
                Serilog.Log.Information(endpoint);
                Serilog.Log.Information(requesrData);
                Serilog.Log.Information(ex.Message);
                Serilog.Log.Information(JsonConvert.SerializeObject(ex));
                response.Message = ex.Message;
            }

            return response;
        }

        public Task<QueryStatusResponseModel> QueryStatusAsync(PartnerMoMoPaymentConfigModel config, QueryStatusRequestModel request)
        {
            string endpoint = $"{_momoSettings.DomainProduction}/v2/gateway/api/query";

            /// Momo Configs
            string SecretKey = config.SecretKey;
            string partnerCode = config.PartnerCode;
            string accessKey = config.AccessKey;

            /// Request data
            string requestId = request.RequestId;
            string amount = request.Amount;
            string orderId = request.OrderId;

            string rawHash =
                $"accessKey={accessKey}&" +
                $"orderId={orderId}&" +
                $"partnerCode={partnerCode}&" +
                $"requestId={requestId}";

            var momoSecurity = new MoMoSecurity();
            string signature = momoSecurity.SignSHA256(rawHash, SecretKey);
            var requestData = new JObject
            {
                { "partnerCode", partnerCode },
                { "requestId", requestId },
                { "orderId", orderId },
                { "amount", amount },
                { "lang", "vi" },
                { "signature", signature },
            };

            var responseFromMomo = MoMoPaymentRequest.SendPaymentRequest(endpoint, requestData.ToString());
            var createGetwayResponseModel = JsonConvert.DeserializeObject<QueryStatusResponseModel>(responseFromMomo.Data);
            return Task.FromResult(createGetwayResponseModel);
        }

        public Task<string> CreateDynamicQRCodeContentAsync(PartnerMoMoPaymentConfigModel config, CreateDynamicQRCodeModel request)
        {
            string domain = $"{_momoSettings.DomainProduction}";
            string SecretKey = config.SecretKey;
            string rawHash =
                $"storeSlug={request.StoreSlug}&" +
                $"amount={request.Amount}&" +
                $"billId={request.BillId}&" +
                $"extra={request.Extra}";
            var momoSecurity = new MoMoSecurity();
            string signature = momoSecurity.SignSHA256(rawHash, SecretKey);
            var qrCodeContent = $"{domain}/pay/store/{request.StoreSlug}?a={request.Amount}&b={request.BillId}&extra={request.Extra}&s={signature}";

            if (string.IsNullOrWhiteSpace(request.Extra))
            {
                rawHash =
                $"storeSlug={request.StoreSlug}&" +
                $"amount={request.Amount}&" +
                $"billId={request.BillId}";
                signature = momoSecurity.SignSHA256(rawHash, SecretKey);
                qrCodeContent = $"{domain}/pay/store/{request.StoreSlug}?a={request.Amount}&b={request.BillId}&s={signature}";
            }

            return Task.FromResult(qrCodeContent);
        }

        /// <summary>
        /// docs: https://developers.momo.vn/v3/vi/docs/payment/api/payment-api/refund/#http-request
        /// </summary>
        /// <param name="config"></param>
        /// <param name="request"></param>
        /// <returns></returns>
        public Task<CreateRefundResponse> CreateRefundAsync(PartnerMoMoPaymentConfigModel config, CreateRefundRequest request)
        {
            string endpoint = $"{_momoSettings.DomainProduction}/v2/gateway/api/refund";

            // Momo Configs
            string SecretKey = config.SecretKey;
            string partnerCode = config.PartnerCode;
            string accessKey = config.AccessKey;

            /// Request data
            string requestId = request.RequestId;
            long amount = request.Amount;
            string orderId = request.OrderId;
            string description = request.Description;
            long transId = request.TransId;

            string rawHash =
                $"accessKey={accessKey}&" +
                $"amount={amount}&" +
                $"description={description}&" +
                $"orderId={orderId}&" +
                $"partnerCode={partnerCode}&" +
                $"requestId={requestId}&" +
                $"transId={transId}";

            var momoSecurity = new MoMoSecurity();
            string signature = momoSecurity.SignSHA256(rawHash, SecretKey);
            var requestData = new JObject
            {
                { "partnerCode", partnerCode },
                { "orderId", orderId },
                { "requestId", requestId },
                { "amount", amount },
                { "transId", transId },
                { "lang", "vi" },
                { "description", description },
                { "signature", signature },
            };

            var responseFromMomo = MoMoPaymentRequest.SendPaymentRequest(endpoint, requestData.ToString());
            var createRefundResponseModel = JsonConvert.DeserializeObject<CreateRefundResponse>(responseFromMomo.Data);
            return Task.FromResult(createRefundResponseModel);
        }

        public string Base64Encode(JObject jObject)
        {
            if (jObject == null) return null;
            var plainTextBytes = System.Text.Encoding.UTF8.GetBytes(jObject.ToString());
            return System.Convert.ToBase64String(plainTextBytes);
        }

        public async Task<AuthenticatedCheckResponseModel> AuthenticatedCheckAsync(AuthenticatedCheckRequestModel request, LoggedUserModel loggedUser)
        {
            var paymentConfig = new PartnerMoMoPaymentConfigModel()
            {
                AccessKey = request.AccessKey,
                PartnerCode = request.PartnerCode,
                SecretKey = request.SecretKey,
            };
            var site = "https://webhook.site/b3088a6a-2d17-4f8d-a383-71389a6c600b";
            var nameEmail = loggedUser.Email.Split("+")[0];
            var emainDomain = loggedUser.Email.Split("@")[1];
            var requestGateway = new CreateGetwayRequestModel()
            {
                RequestId = Guid.NewGuid().ToString(),
                Amount = "0",
                ExtraData = "",
                OrderId = Guid.NewGuid().ToString(),
                OrderInfo = $"CreateGateway{request.PartnerCode}",
                PartnerClientId = $"{nameEmail}@{emainDomain}",
                RedirectUrl = site,
                IpnUrl = site
            };
            var result = new AuthenticatedCheckResponseModel
            {
                IsSuccess = false,
                Message = "payment.authenticationFail"
            };
            try
            {
                var createGateway = await CreateGatewayTestingAsync(paymentConfig, requestGateway);

                if (createGateway != null && createGateway.ResultCode == 0)
                {
                    result.IsSuccess = true;
                    result.Message = createGateway.Message;
                }
                return result;
            }
            catch (Exception)
            {
                throw new Exception("payment.authenticationFail");
            }
        }
    }
}
