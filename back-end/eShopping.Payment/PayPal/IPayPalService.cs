using eShopping.Common.Models.Base;
using eShopping.Payment.PayPal.Model;
using System.Threading;
using System.Threading.Tasks;

namespace eShopping.Payment.PayPal;
public interface IPayPalService
{
    #region Custom services

    /// <summary>
    /// Exchange amount's currency to paypal' currency (USD)
    /// </summary>
    /// <param name="amount"></param>
    /// <param name="currency"></param>
    /// <returns></returns>
    decimal PayPalGetAmountBaseOnCustomerCurrency(decimal amount, string currency);
    decimal PayPalFeeCalculation(decimal totalAmount, string fromCurrency, string toCurrency);
    #endregion

    #region PayPal API v1
    Task<PayPalAccessTokenResponse> GetPayPalAccessTokenAsync(CancellationToken cancellationToken);

    Task<string> TerminateAccessTokenAsync(string token, CancellationToken cancellationToken);

    Task<ApiResponseModel<PayPalCreateOrderResponse>> CreatePaypalPaymentAsync(decimal amount, string domainUrl, string returnEndPoint, CancellationToken cancellationToken);

    Task<ApiResponseModel<PayPalCreateOrderResponse>> ExecutePaypalPaymentAsync(string paymentId, string payerId, CancellationToken cancellationToken);

    Task<PayPalUserInfoResponse> GetUserInfoAsync(CancellationToken cancellationToken);

    Task<PayPalGenerateClientTokenResponse> GetClientTokenAsync(CancellationToken cancellationToken);

    #endregion

    #region PayPal API v2

    Task<ApiResponseModel<PayPalCreateOrderResponse>> CreateCheckoutOrderAsync(decimal amount, CancellationToken cancellationToken);

    Task<PayPalCreateOrderResponse> GetOrderDetailByOrderIdAsync(string paymentId, CancellationToken cancellationToken);

    Task<PayPalCreateOrderResponse> UpdateCheckoutOrderAsync(string id, PayPalOrderCheckoutUpdateDetailModel[] updateDetails, CancellationToken cancellationToken);

    Task<PayPalAuthorizeOrderResponse> AuthorizeCheckoutOrderByOrderIdAsync(string id, CancellationToken cancellationToken);

    Task<PayPalAuthorizeOrderResponse> ReAuthorizeCheckoutOrderByOrderIdAsync(string id, CancellationToken cancellationToken);

    Task<PayPalCreateOrderResponse> CaptureCheckoutOrderAsync(string token, string payerId, CancellationToken cancellationToken);

    Task<bool> AuthorizedPaymentAsync(string authorizationId, CancellationToken cancellationToken);

    Task<string> CaptureAuthorizedPaymentAsync(CaptureAuthorizedPaymentRequestModel data, CancellationToken cancellationToken);

    Task<string> GetCapturedPaymentDetailAsync(string captureId, CancellationToken cancellationToken);

    Task<string> RefundCapturedPaymentAsync(RefundCapturedPaymentRequestModel data, CancellationToken cancellationToken);

    Task<string> GetRefundDetailAsync(string refundId, CancellationToken cancellationToken);

    #endregion

    #region PayPal API v3
    Task<string> SetUpTokenAsync(SetUpTokenRequestModel data, CancellationToken cancellationToken);

    Task<string> RetrieveSetupTokenAsync(string setupTokenId, CancellationToken cancellationToken);

    Task<string> PaymentTokensAsync(string setupTokenId, CancellationToken cancellationToken);

    Task<string> RetrievePaymentTokenAsync(string paymentTokenId, CancellationToken cancellationToken);

    Task<bool> DeletePaymentTokenAsync(string paymentTokenId, CancellationToken cancellationToken);

    Task<string> ListAllPaymentTokenByCustomerAsync(string customerId, CancellationToken cancellationToken);

    #endregion
}
