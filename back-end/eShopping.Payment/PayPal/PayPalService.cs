using eShopping.Common.AutoWire;
using eShopping.Common.Constants;
using eShopping.Common.Helpers;
using eShopping.Common.Models.Base;
using eShopping.Domain.Settings;
using eShopping.Payment.PayPal.Common;
using eShopping.Payment.PayPal.Model;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace eShopping.Payment.PayPal;

[AutoService(typeof(IPayPalService), Lifetime = ServiceLifetime.Scoped)]
public class PayPalService : IPayPalService
{
    private readonly PayPalSettings _payPalSettings;
    private readonly string _domainUrl;
    private readonly IHttpClientFactory _httpClientFactory;
    public PayPalService(IOptions<AppSettings> appSettings, IHttpClientFactory httpClientFactory)
    {
        _payPalSettings = appSettings.Value?.PaymentSettings?.PayPalSettings;
        _domainUrl = appSettings.Value?.DomainPOSWeb;
        _httpClientFactory = httpClientFactory;
    }

    #region Custom services

    public decimal PayPalGetAmountBaseOnCustomerCurrency(decimal amount, string currency)
    {
        var totalAmount = amount;
        var isVietNamCountry = currency == DefaultConstants.CURRENCY_VND;
        if (isVietNamCountry)
        {
            totalAmount = CurrencyHelpers.ConvertVNDtoUSD(totalAmount);
        }
        return totalAmount;
    }

    /// <summary>
    /// Calculate PayPal Fee
    /// Refer to US comment: User Story 42726: [Admin] Payment for Package - PayPal
    /// Link reference: https://www.paypal.com/vn/webapps/mpp/paypal-fees
    /// </summary>
    /// <returns>USD currency</returns>
    public decimal PayPalFeeCalculation(decimal totalAmount, string fromCurrency, string toCurrency)
    {
        decimal payPalPercentFee;
        decimal payPalDefaultFee = 0.49m; // USD
        var isInternalCountry = fromCurrency.ToUpper() == toCurrency.ToUpper();
        if (isInternalCountry)
        {
            payPalPercentFee = 3.49m / 100;
        }
        else
        {
            payPalPercentFee = 4.99m / 100;
        }
        var percentWithoutFee = 1 - payPalPercentFee;
        return ((totalAmount + payPalDefaultFee) / percentWithoutFee) - totalAmount;
    }
    #endregion
    #region API v1

    /// <summary>
    /// Generate app token
    /// Docs: https://developer.paypal.com/api/rest/authentication/
    /// </summary>
    /// <returns></returns>
    public async Task<PayPalAccessTokenResponse> GetPayPalAccessTokenAsync(CancellationToken cancellationToken)
    {
        using HttpClient httpClient = _httpClientFactory.CreateClient(HttpClientFactoryConstants.PAYPAL);
        var clientId = _payPalSettings.ClientId;
        var secret = _payPalSettings.ClientSecret;

        byte[] bytes = Encoding.GetEncoding(PayPalConstants.ISO_8859_1).GetBytes($"{clientId}:{secret}");

        HttpRequestMessage request = new(HttpMethod.Post, PayPalEndPoints.OAUTH2_TOKEN_V1);
        request.Headers.Authorization = new AuthenticationHeaderValue(PayPalConstants.BASIC, Convert.ToBase64String(bytes));

        var form = new Dictionary<string, string>
        {
            [PayPalConstants.GRANT_TYPE] = PayPalConstants.CLIENT_CREDENTIALS
        };

        request.Content = new FormUrlEncodedContent(form);

        HttpResponseMessage response = await httpClient.SendAsync(request, cancellationToken);

        string content = await response.Content.ReadAsStringAsync(cancellationToken);
        PayPalAccessTokenResponse accessToken = JsonConvert.DeserializeObject<PayPalAccessTokenResponse>(content);
        return accessToken;
    }

    /// <summary>
    /// Generate client token
    /// Docs: https://developer.paypal.com/api/rest/postman/
    /// </summary>
    /// <returns></returns>
    public async Task<PayPalGenerateClientTokenResponse> GetClientTokenAsync(CancellationToken cancellationToken)
    {
        using HttpClient httpClient = _httpClientFactory.CreateClient(HttpClientFactoryConstants.PAYPAL);
        HttpRequestMessage request = new(HttpMethod.Post, PayPalEndPoints.GENERATE_CLIENT_TOKEN_V1);
        var tokenDetail = await GetPayPalAccessTokenAsync(cancellationToken);
        request.Headers.Authorization = new AuthenticationHeaderValue(PayPalConstants.BEARER, tokenDetail.AccessToken);

        var requestBody = JObject.FromObject(new
        {
            customer_id = DateTime.Now.Ticks
        });

        request.Content = new StringContent(JsonConvert.SerializeObject(requestBody), Encoding.UTF8, PayPalConstants.CONTENT_TYPE_APPLICATION_JSON);

        HttpResponseMessage response = await httpClient.SendAsync(request, cancellationToken);
        string content = await response.Content.ReadAsStringAsync(cancellationToken);
        PayPalGenerateClientTokenResponse result = JsonConvert.DeserializeObject<PayPalGenerateClientTokenResponse>(content);
        return result;
    }

    /// <summary>
    /// Get user info
    /// Docs: https://developer.paypal.com/api/rest/postman/
    /// </summary>
    /// <returns></returns>
    public async Task<PayPalUserInfoResponse> GetUserInfoAsync(CancellationToken cancellationToken)
    {
        using HttpClient httpClient = _httpClientFactory.CreateClient(HttpClientFactoryConstants.PAYPAL);
        HttpRequestMessage request = new(HttpMethod.Get, PayPalEndPoints.GET_USER_INFO_V1);
        var tokenDetail = await GetPayPalAccessTokenAsync(cancellationToken);
        request.Headers.Authorization = new AuthenticationHeaderValue(PayPalConstants.BEARER, tokenDetail.AccessToken);

        HttpResponseMessage response = await httpClient.SendAsync(request, cancellationToken);
        string content = await response.Content.ReadAsStringAsync(cancellationToken);
        PayPalUserInfoResponse result = JsonConvert.DeserializeObject<PayPalUserInfoResponse>(content);
        return result;
    }

    /// <summary>
    /// Terminate access token
    /// Docs: https://developer.paypal.com/api/rest/postman/
    /// </summary>
    /// <param name="accessToken"></param>
    /// <returns></returns>
    public async Task<string> TerminateAccessTokenAsync(string accessToken, CancellationToken cancellationToken)
    {
        using HttpClient httpClient = _httpClientFactory.CreateClient(HttpClientFactoryConstants.PAYPAL);
        HttpRequestMessage request = new(HttpMethod.Post, PayPalEndPoints.TERMINATE_APP_TOKEN_V1);
        var tokenDetail = await GetPayPalAccessTokenAsync(cancellationToken);
        request.Headers.Authorization = new AuthenticationHeaderValue(PayPalConstants.BEARER, tokenDetail.AccessToken);

        var requestBody = new Dictionary<string, string>
        {
            { PayPalConstants.TOKEN, accessToken },
            { PayPalConstants.TOKEN_TYPE_HINT, PayPalConstants.ACCESS_TOKEN }
        };

        request.Content = new FormUrlEncodedContent(requestBody);

        HttpResponseMessage response = await httpClient.SendAsync(request, cancellationToken);
        string content = await response.Content.ReadAsStringAsync(cancellationToken);
        string result = JsonConvert.DeserializeObject<string>(content);
        return result;
    }

    /// <summary>
    /// Create direct payment
    /// Docs: https://developer.paypal.com/docs/api/payments/v1/#payment_create
    /// </summary>
    /// <param name="amount"></param>
    /// <returns></returns>
    public async Task<ApiResponseModel<PayPalCreateOrderResponse>> CreatePaypalPaymentAsync(decimal amount, string domainUrl, string returnEndPoint, CancellationToken cancellationToken)
    {
        ApiResponseModel<PayPalCreateOrderResponse> responseModel = new();
        try
        {
            using HttpClient httpClient = _httpClientFactory.CreateClient(HttpClientFactoryConstants.PAYPAL);
            HttpRequestMessage request = new(HttpMethod.Post, PayPalEndPoints.CREATE_PAYMENT_V1);
            var tokenDetail = await GetPayPalAccessTokenAsync(cancellationToken);
            request.Headers.Authorization = new AuthenticationHeaderValue(PayPalConstants.BEARER, tokenDetail.AccessToken);

            if (string.IsNullOrEmpty(returnEndPoint))
            {
                returnEndPoint = PayPalEndPoints.WEBHOOK_RETURN_SUCCESS_PAYMENT_ENDPOINT_V1;
            }

            var payment = JObject.FromObject(new
            {
                intent = PayPalConstants.SALE,
                redirect_urls = new
                {
                    return_url = $"{domainUrl}/{returnEndPoint}",
                    cancel_url = $"{domainUrl}/{returnEndPoint}"
                },
                payer = new { payment_method = PayPalConstants.PAYPAL },
                transactions = JArray.FromObject(new[]
                {
                    new
                    {
                        amount = new
                        {
                            total = amount,
                            currency = DefaultConstants.CURRENCY_USD
                        }
                    }
                })
            });

            request.Content = new StringContent(JsonConvert.SerializeObject(payment), Encoding.UTF8, PayPalConstants.CONTENT_TYPE_APPLICATION_JSON);

            HttpResponseMessage response = await httpClient.SendAsync(request, cancellationToken);
            string content = await response.Content.ReadAsStringAsync(cancellationToken);
            if (response.StatusCode == HttpStatusCode.Created)
            {
                PayPalCreateOrderResponse paypalPaymentCreated = JsonConvert.DeserializeObject<PayPalCreateOrderResponse>(content);
                responseModel.Success = true;
                responseModel.Data = paypalPaymentCreated;
            }
            else
            {
                responseModel.Success = false;
                responseModel.ErrorMessage = content;
            }
            return responseModel;
        }
        catch (Exception ex)
        {
            responseModel.Success = false;
            responseModel.ErrorMessage = ex.Message;
            return responseModel;
        }
    }

    /// <summary>
    /// Execute direct payment
    /// Docs: https://developer.paypal.com/docs/api/payments/v1/#payment_execute
    /// </summary>
    /// <param name="paymentId"></param>
    /// <param name="payerId"></param>
    /// <returns></returns>
    public async Task<ApiResponseModel<PayPalCreateOrderResponse>> ExecutePaypalPaymentAsync(string paymentId, string payerId, CancellationToken cancellationToken)
    {
        ApiResponseModel<PayPalCreateOrderResponse> responseModel = new();
        try
        {
            using HttpClient httpClient = _httpClientFactory.CreateClient(HttpClientFactoryConstants.PAYPAL);
            HttpRequestMessage request = new(HttpMethod.Post, PayPalEndPoints.EXECUTE_PAYMENT_V1.Replace("{paymentId}", paymentId));
            var tokenDetail = await GetPayPalAccessTokenAsync(cancellationToken);
            request.Headers.Authorization = new AuthenticationHeaderValue(PayPalConstants.BEARER, tokenDetail.AccessToken);

            var payment = JObject.FromObject(new
            {
                payer_id = payerId
            });

            request.Content = new StringContent(JsonConvert.SerializeObject(payment), Encoding.UTF8, PayPalConstants.CONTENT_TYPE_APPLICATION_JSON);

            HttpResponseMessage response = await httpClient.SendAsync(request, cancellationToken);
            string content = await response.Content.ReadAsStringAsync(cancellationToken);
            if (response.StatusCode == HttpStatusCode.OK)
            {
                PayPalCreateOrderResponse executedPayment = JsonConvert.DeserializeObject<PayPalCreateOrderResponse>(content);
                responseModel.Success = true;
                responseModel.Data = executedPayment;
            }
            else
            {
                responseModel.Success = false;
                responseModel.ErrorMessage = content;
            }
            return responseModel;
        }
        catch (Exception ex)
        {
            responseModel.Success = false;
            responseModel.ErrorMessage = ex.Message;
            return responseModel;
        }
    }

    #endregion
    #region API v2

    /// <summary>
    /// Get order detail
    /// Docs: https://developer.paypal.com/docs/api/orders/v2/#orders_get
    /// </summary>
    /// <param name="id"></param>
    /// <returns></returns>
    public async Task<PayPalCreateOrderResponse> GetOrderDetailByOrderIdAsync(string id, CancellationToken cancellationToken)
    {
        using HttpClient httpClient = _httpClientFactory.CreateClient(HttpClientFactoryConstants.PAYPAL);
        HttpRequestMessage request = new(HttpMethod.Get, PayPalEndPoints.GET_ORDER_DETAIL_V2.Replace("{id}", id));
        var tokenDetail = await GetPayPalAccessTokenAsync(cancellationToken);
        request.Headers.Authorization = new AuthenticationHeaderValue(PayPalConstants.BEARER, tokenDetail.AccessToken);
        request.Content = new StringContent(PayPalConstants.CONTENT_TYPE_APPLICATION_JSON);

        HttpResponseMessage response = await httpClient.SendAsync(request, cancellationToken);

        string content = await response.Content.ReadAsStringAsync(cancellationToken);
        PayPalCreateOrderResponse orderResponse = JsonConvert.DeserializeObject<PayPalCreateOrderResponse>(content);
        return orderResponse;
    }

    /// <summary>
    /// Create order
    /// Docs: https://developer.paypal.com/docs/api/orders/v2/#orders_create
    /// </summary>
    /// <param name="amount"></param>
    /// <returns></returns>
    public async Task<ApiResponseModel<PayPalCreateOrderResponse>> CreateCheckoutOrderAsync(decimal amount, CancellationToken cancellationToken)
    {
        ApiResponseModel<PayPalCreateOrderResponse> responseModel = new();
        try
        {
            using HttpClient httpClient = _httpClientFactory.CreateClient(HttpClientFactoryConstants.PAYPAL);
            HttpRequestMessage request = new(HttpMethod.Post, PayPalEndPoints.CREATE_ORDER_V2);
            var tokenDetail = await GetPayPalAccessTokenAsync(cancellationToken);
            request.Headers.Authorization = new AuthenticationHeaderValue(PayPalConstants.BEARER, tokenDetail.AccessToken);

            var payment = JObject.FromObject(new
            {
                intent = PayPalConstants.CAPTURE,
                purchase_units = JArray.FromObject(Array.Empty<object>()),
                create_time = DateTime.Now,
                application_context = new
                {
                    return_url = $"{_domainUrl}/{PayPalEndPoints.WEBHOOK_RETURN_SUCCESS_PAYMENT_ENDPOINT_V2}",
                    cancel_url = "https://example.com/your_cancel_url.html"
                }
            });
            var purchaseUnitsArray = (JArray)payment["purchase_units"];

            purchaseUnitsArray.Add(JObject.FromObject(new
            {
                amount = new
                {
                    currency_code = DefaultConstants.CURRENCY_USD,
                    value = amount
                }
            }));

            request.Content = new StringContent(JsonConvert.SerializeObject(payment), Encoding.UTF8, PayPalConstants.CONTENT_TYPE_APPLICATION_JSON);

            HttpResponseMessage response = await httpClient.SendAsync(request, cancellationToken);
            string content = await response.Content.ReadAsStringAsync(cancellationToken);
            if (response.StatusCode == HttpStatusCode.OK)
            {
                PayPalCreateOrderResponse orderResponse = JsonConvert.DeserializeObject<PayPalCreateOrderResponse>(content);
                responseModel.Success = true;
                responseModel.Data = orderResponse;
            }
            else
            {
                responseModel.Success = false;
                responseModel.ErrorMessage = content;
            }
            return responseModel;
        }
        catch (Exception ex)
        {
            responseModel.Success = false;
            responseModel.ErrorMessage = ex.Message;
            return responseModel;
        }
    }

    /// <summary>
    /// Update order
    /// Docs: https://developer.paypal.com/docs/api/orders/v2/#orders_patch
    /// </summary>
    /// <param name="id"></param>
    /// <param name="updateDetails"></param>
    /// <returns></returns>
    public async Task<PayPalCreateOrderResponse> UpdateCheckoutOrderAsync(string id, PayPalOrderCheckoutUpdateDetailModel[] updateDetails, CancellationToken cancellationToken)
    {
        using HttpClient httpClient = _httpClientFactory.CreateClient(HttpClientFactoryConstants.PAYPAL);
        HttpRequestMessage request = new(HttpMethod.Patch, PayPalEndPoints.UPDATE_ORDER_V2.Replace("{id}", id));
        var tokenDetail = await GetPayPalAccessTokenAsync(cancellationToken);
        request.Headers.Authorization = new AuthenticationHeaderValue(PayPalConstants.BEARER, tokenDetail.AccessToken);

        JArray requestBodyArray = new();

        foreach (var updateDetail in updateDetails)
        {
            requestBodyArray.Add(JObject.FromObject(new
            {
                op = updateDetail.Op,
                path = updateDetail.Path,
                value = updateDetail.Value
            }));
        }

        request.Content = new StringContent(JsonConvert.SerializeObject(requestBodyArray), Encoding.UTF8, PayPalConstants.CONTENT_TYPE_APPLICATION_JSON);

        HttpResponseMessage response = await httpClient.SendAsync(request, cancellationToken);

        string content = await response.Content.ReadAsStringAsync(cancellationToken);
        PayPalCreateOrderResponse orderResponse = JsonConvert.DeserializeObject<PayPalCreateOrderResponse>(content);
        return orderResponse;
    }

    /// <summary>
    /// Authorize order
    /// Docs: https://developer.paypal.com/docs/api/orders/v2/#orders_authorize
    /// </summary>
    /// <param name="id"></param>
    /// <returns></returns>
    public async Task<PayPalAuthorizeOrderResponse> AuthorizeCheckoutOrderByOrderIdAsync(string id, CancellationToken cancellationToken)
    {
        using HttpClient httpClient = _httpClientFactory.CreateClient(HttpClientFactoryConstants.PAYPAL);
        HttpRequestMessage request = new(HttpMethod.Post, PayPalEndPoints.AUTHORIZE_ORDER_V2.Replace("{authorization_id}", id));
        var tokenDetail = await GetPayPalAccessTokenAsync(cancellationToken);
        request.Headers.Authorization = new AuthenticationHeaderValue(PayPalConstants.BEARER, tokenDetail.AccessToken);

        request.Content = new StringContent(PayPalConstants.CONTENT_TYPE_APPLICATION_JSON);

        // TODO: Get authorize Id then send request

        HttpResponseMessage response = await httpClient.SendAsync(request, cancellationToken);

        string content = await response.Content.ReadAsStringAsync(cancellationToken);
        PayPalAuthorizeOrderResponse orderResponse = JsonConvert.DeserializeObject<PayPalAuthorizeOrderResponse>(content);
        return orderResponse;
    }

    /// <summary>
    /// Re-Authorize order
    /// Docs: https://developer.paypal.com/docs/api/payments/v2/#authorizations_reauthorize
    /// </summary>
    /// <param name="id"></param>
    /// <returns></returns>
    public async Task<PayPalAuthorizeOrderResponse> ReAuthorizeCheckoutOrderByOrderIdAsync(string id, CancellationToken cancellationToken)
    {
        using HttpClient httpClient = _httpClientFactory.CreateClient(HttpClientFactoryConstants.PAYPAL);
        HttpRequestMessage request = new(HttpMethod.Post, PayPalEndPoints.REAUTHORIZE_AUTHORIZED_PAYMENT_V2.Replace("{authorization_id}", id));
        var tokenDetail = await GetPayPalAccessTokenAsync(cancellationToken);
        request.Headers.Authorization = new AuthenticationHeaderValue(PayPalConstants.BEARER, tokenDetail.AccessToken);

        request.Content = new StringContent(PayPalConstants.CONTENT_TYPE_APPLICATION_JSON);

        // TODO: Get authorize Id then send request

        HttpResponseMessage response = await httpClient.SendAsync(request, cancellationToken);

        string content = await response.Content.ReadAsStringAsync(cancellationToken);
        PayPalAuthorizeOrderResponse orderResponse = JsonConvert.DeserializeObject<PayPalAuthorizeOrderResponse>(content);
        return orderResponse;
    }

    /// <summary>
    /// Capture order
    /// Docs: https://developer.paypal.com/docs/api/orders/v2/#orders_capture
    /// </summary>
    /// <param name="token"></param>
    /// <param name="payerId"></param>
    /// <returns></returns>
    public async Task<PayPalCreateOrderResponse> CaptureCheckoutOrderAsync(string token, string payerId, CancellationToken cancellationToken)
    {
        using HttpClient httpClient = _httpClientFactory.CreateClient(HttpClientFactoryConstants.PAYPAL);
        HttpRequestMessage request = new(HttpMethod.Post, PayPalEndPoints.CAPTURE_ORDER_V2.Replace("{order_id}", token));
        var tokenDetail = await GetPayPalAccessTokenAsync(cancellationToken);
        request.Headers.Authorization = new AuthenticationHeaderValue(PayPalConstants.BEARER, tokenDetail.AccessToken);

        var requestBody = JObject.FromObject(new
        {
            payer_id = payerId
        });

        request.Content = new StringContent(JsonConvert.SerializeObject(requestBody), Encoding.UTF8, PayPalConstants.CONTENT_TYPE_APPLICATION_JSON);

        HttpResponseMessage response = await httpClient.SendAsync(request, cancellationToken);

        string content = await response.Content.ReadAsStringAsync(cancellationToken);
        PayPalCreateOrderResponse orderResponse = JsonConvert.DeserializeObject<PayPalCreateOrderResponse>(content);
        return orderResponse;
    }

    /// <summary>
    /// Authorize payment
    /// Docs: https://developer.paypal.com/docs/api/payments/v2/#authorizations_void
    /// </summary>
    /// <param name="authorizationId"></param>
    /// <returns></returns>
    public async Task<bool> AuthorizedPaymentAsync(string authorizationId, CancellationToken cancellationToken)
    {
        try
        {
            using HttpClient httpClient = _httpClientFactory.CreateClient(HttpClientFactoryConstants.PAYPAL);
            HttpRequestMessage request = new(HttpMethod.Post, PayPalEndPoints.AUTHORIZED_PAYMENT_ENDPOINT_V2.Replace("{authorizationId}", authorizationId));
            var tokenDetail = await GetPayPalAccessTokenAsync(cancellationToken);
            request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", tokenDetail.AccessToken);
            HttpResponseMessage response = await httpClient.SendAsync(request, cancellationToken);
            return response.IsSuccessStatusCode;
        }
        catch
        {
            return false;
        }
    }

    /// <summary>
    /// Capture authorize payment
    /// Docs: https://developer.paypal.com/docs/api/payments/v2/#authorizations_capture
    /// </summary>
    /// <param name="data"></param>
    /// <returns></returns>
    public async Task<string> CaptureAuthorizedPaymentAsync(CaptureAuthorizedPaymentRequestModel data, CancellationToken cancellationToken)
    {
        using HttpClient httpClient = _httpClientFactory.CreateClient(HttpClientFactoryConstants.PAYPAL);
        HttpRequestMessage request = new(HttpMethod.Post, PayPalEndPoints.CAPTURE_AUTHORIZED_PAYMENT_ENDPOINT_V2.Replace("{authorizationId}", data.AuthorizationId));
        var tokenDetail = await GetPayPalAccessTokenAsync(cancellationToken);
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", tokenDetail.AccessToken);

        var requestParams = JObject.FromObject(new
        {
            amount = new { value = data.Amount, currency_code = DefaultConstants.CURRENCY_USD },
            invoice_id = data.InvoiceId,
            final_capture = true,
            note_to_payer = data.NoteToPayer,
            soft_descriptor = data.SoftDescriptor
        });

        request.Content = new StringContent(JsonConvert.SerializeObject(requestParams), Encoding.UTF8, "application/json");

        HttpResponseMessage response = await httpClient.SendAsync(request, cancellationToken);
        string content = await response.Content.ReadAsStringAsync(cancellationToken);
        return content;
    }

    /// <summary>
    /// Get capture payment detail
    /// Docs: https://developer.paypal.com/docs/api/payments/v2/#authorizations_capture
    /// </summary>
    /// <param name="data"></param>
    /// <returns></returns>
    public async Task<string> GetCapturedPaymentDetailAsync(string captureId, CancellationToken cancellationToken)
    {
        using HttpClient httpClient = _httpClientFactory.CreateClient(HttpClientFactoryConstants.PAYPAL);
        HttpRequestMessage request = new(HttpMethod.Get, PayPalEndPoints.GET_CAPTURED_PAYMENT_DETAIL_ENDPOINT_V2.Replace("{captureId}", captureId));
        var tokenDetail = await GetPayPalAccessTokenAsync(cancellationToken);
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", tokenDetail.AccessToken);

        HttpResponseMessage response = await httpClient.SendAsync(request, cancellationToken);
        string content = await response.Content.ReadAsStringAsync(cancellationToken);
        return content;
    }

    /// <summary>
    /// Refund capture payment
    /// Docs: https://developer.paypal.com/docs/api/payments/v2/#captures_refund
    /// </summary>
    /// <param name="data"></param>
    /// <returns></returns>
    public async Task<string> RefundCapturedPaymentAsync(RefundCapturedPaymentRequestModel data, CancellationToken cancellationToken)
    {
        using HttpClient httpClient = _httpClientFactory.CreateClient(HttpClientFactoryConstants.PAYPAL);
        HttpRequestMessage request = new(HttpMethod.Post, PayPalEndPoints.REFUND_CAPTURED_PAYMENT_ENDPOINT_V2.Replace("{captureId}", data.CaptureId));
        var tokenDetail = await GetPayPalAccessTokenAsync(cancellationToken);
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", tokenDetail.AccessToken);

        var requestParams = JObject.FromObject(new
        {
            amount = new { value = data.Amount, currency_code = DefaultConstants.CURRENCY_USD },
            invoice_id = data.InvoiceId,
            note_to_payer = data.NoteToPayer,
        });

        request.Content = new StringContent(JsonConvert.SerializeObject(requestParams), Encoding.UTF8, "application/json");

        HttpResponseMessage response = await httpClient.SendAsync(request, cancellationToken);
        string content = await response.Content.ReadAsStringAsync(cancellationToken);
        return content;
    }

    /// <summary>
    /// Get refund capture payment
    /// Docs: https://developer.paypal.com/docs/api/payments/v2/#refunds_get
    /// </summary>
    /// <param name="data"></param>
    /// <returns></returns>
    public async Task<string> GetRefundDetailAsync(string refundId, CancellationToken cancellationToken)
    {
        using HttpClient httpClient = _httpClientFactory.CreateClient(HttpClientFactoryConstants.PAYPAL);
        HttpRequestMessage request = new(HttpMethod.Get, PayPalEndPoints.GET_REFUND_DETAIL_ENDPOINT_V2.Replace("{refundId}", refundId));
        var tokenDetail = await GetPayPalAccessTokenAsync(cancellationToken);
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", tokenDetail.AccessToken);

        HttpResponseMessage response = await httpClient.SendAsync(request, cancellationToken);
        string content = await response.Content.ReadAsStringAsync(cancellationToken);
        return content;
    }

    #endregion
    #region API v3

    /// <summary>
    /// Setup token
    /// Docs: https://developer.paypal.com/docs/api/payment-tokens/v3/#setup-tokens_create
    /// </summary>
    /// <param name="data"></param>
    /// <returns></returns>
    public async Task<string> SetUpTokenAsync(SetUpTokenRequestModel data, CancellationToken cancellationToken)
    {
        using HttpClient httpClient = _httpClientFactory.CreateClient(HttpClientFactoryConstants.PAYPAL);
        HttpRequestMessage request = new(HttpMethod.Post, PayPalEndPoints.SETUP_TOKEN_ENDPOINT_V3);
        var tokenDetail = await GetPayPalAccessTokenAsync(cancellationToken);
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", tokenDetail.AccessToken);

        var requestParams = JObject.FromObject(new
        {
            payment_source = new
            {
                card = new
                {
                    number = data.CardNumber,
                    expiry = data.Expiry,
                    name = data.Name,
                    billing_address = new
                    {
                        address_line_1 = data.AddressLine1,
                        address_line_2 = data.AddressLine2,
                        admin_area_1 = data.AdminArea1,
                        admin_area_2 = data.AdminArea2,
                        postal_code = data.PostalCode,
                        country_code = data.CountryCode,
                    }
                }
            }
        });

        request.Content = new StringContent(JsonConvert.SerializeObject(requestParams), Encoding.UTF8, "application/json");

        HttpResponseMessage response = await httpClient.SendAsync(request, cancellationToken);
        string content = await response.Content.ReadAsStringAsync(cancellationToken);
        return content;
    }

    /// <summary>
    /// Retrieve stup token
    /// Docs: https://developer.paypal.com/docs/api/payment-tokens/v3/#setup-tokens_get
    /// </summary>
    /// <param name="setupTokenId"></param>
    /// <returns></returns>
    public async Task<string> RetrieveSetupTokenAsync(string setupTokenId, CancellationToken cancellationToken)
    {
        using HttpClient httpClient = _httpClientFactory.CreateClient(HttpClientFactoryConstants.PAYPAL);
        HttpRequestMessage request = new(HttpMethod.Get, PayPalEndPoints.RETRIEVE_SETUP_TOKEN_ENDPOINT_V3.Replace("{setupTokenId}", setupTokenId));
        var tokenDetail = await GetPayPalAccessTokenAsync(cancellationToken);
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", tokenDetail.AccessToken);

        HttpResponseMessage response = await httpClient.SendAsync(request, cancellationToken);
        string content = await response.Content.ReadAsStringAsync(cancellationToken);
        return content;
    }

    /// <summary>
    /// Create payment tokens
    /// Docs: https://developer.paypal.com/docs/api/payment-tokens/v3/#payment-tokens_create
    /// </summary>
    /// <param name="setupTokenId"></param>
    /// <returns></returns>
    public async Task<string> PaymentTokensAsync(string setupTokenId, CancellationToken cancellationToken)
    {
        using HttpClient httpClient = _httpClientFactory.CreateClient(HttpClientFactoryConstants.PAYPAL);
        HttpRequestMessage request = new(HttpMethod.Post, PayPalEndPoints.PAYMENT_TOKENS_ENDPOINT_V3);
        var tokenDetail = await GetPayPalAccessTokenAsync(cancellationToken);
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", tokenDetail.AccessToken);

        var requestParams = JObject.FromObject(new
        {
            payment_source = new
            {
                token = new
                {
                    id = setupTokenId,
                    type = PayPalConstants.SETUP_TOKEN,
                }
            }
        });

        request.Content = new StringContent(JsonConvert.SerializeObject(requestParams), Encoding.UTF8, "application/json");

        HttpResponseMessage response = await httpClient.SendAsync(request, cancellationToken);
        string content = await response.Content.ReadAsStringAsync(cancellationToken);
        return content;
    }

    /// <summary>
    /// Retrieve payment tokens
    /// Docs: https://developer.paypal.com/docs/api/payment-tokens/v3/#payment-tokens_get
    /// </summary>
    /// <param name="paymentTokenId"></param>
    /// <returns></returns>
    public async Task<string> RetrievePaymentTokenAsync(string paymentTokenId, CancellationToken cancellationToken)
    {
        using HttpClient httpClient = _httpClientFactory.CreateClient(HttpClientFactoryConstants.PAYPAL);
        HttpRequestMessage request = new(HttpMethod.Get, PayPalEndPoints.RETRIEVE_PAYMENT_TOKEN_ENDPOINT_V3.Replace("{paymentTokenId}", paymentTokenId));
        var tokenDetail = await GetPayPalAccessTokenAsync(cancellationToken);
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", tokenDetail.AccessToken);

        HttpResponseMessage response = await httpClient.SendAsync(request, cancellationToken);
        string content = await response.Content.ReadAsStringAsync(cancellationToken);
        return content;
    }

    /// <summary>
    /// Delete payment tokens
    /// Docs: https://developer.paypal.com/docs/api/payment-tokens/v3/#payment-tokens_delete
    /// </summary>
    /// <param name="paymentTokenId"></param>
    /// <returns></returns>
    public async Task<bool> DeletePaymentTokenAsync(string paymentTokenId, CancellationToken cancellationToken)
    {
        try
        {
            using HttpClient httpClient = _httpClientFactory.CreateClient(HttpClientFactoryConstants.PAYPAL);
            HttpRequestMessage request = new(HttpMethod.Delete, PayPalEndPoints.DELETE_PAYMENT_TOKEN_ENDPOINT_V3.Replace("{paymentTokenId}", paymentTokenId));
            var tokenDetail = await GetPayPalAccessTokenAsync(cancellationToken);
            request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", tokenDetail.AccessToken);
            HttpResponseMessage response = await httpClient.SendAsync(request, cancellationToken);
            return response.IsSuccessStatusCode;
        }
        catch
        {
            return false;
        }
    }

    /// <summary>
    /// List payment tokens
    /// Docs: https://developer.paypal.com/docs/api/payment-tokens/v3/#customer_payment-tokens_get
    /// </summary>
    /// <param name="customerId"></param>
    /// <returns></returns>
    public async Task<string> ListAllPaymentTokenByCustomerAsync(string customerId, CancellationToken cancellationToken)
    {
        using HttpClient httpClient = _httpClientFactory.CreateClient(HttpClientFactoryConstants.PAYPAL);
        HttpRequestMessage request = new(HttpMethod.Get, PayPalEndPoints.LIST_ALL_PAYMENT_TOKEN_BY_CUSTOMER_ENDPOINT_V3.Replace("{customerId}", customerId));
        var tokenDetail = await GetPayPalAccessTokenAsync(cancellationToken);
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", tokenDetail.AccessToken);

        HttpResponseMessage response = await httpClient.SendAsync(request, cancellationToken);
        string content = await response.Content.ReadAsStringAsync(cancellationToken);
        return content;
    }

    #endregion
}

