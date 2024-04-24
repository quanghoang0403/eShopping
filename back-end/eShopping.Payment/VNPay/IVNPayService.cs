using eShopping.Payment.VNPay.Model;
using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;

namespace eShopping.Payment.VNPay
{
    /// <summary>
    /// Status code VNPAY: https://sandbox.vnpayment.vn/apis/docs/thanh-toan-pay/pay.html#Bang-ma-loi-PAY
    /// </summary>
    public interface IVNPayService
    {
        /// <summary>
        /// Create VNPAY payment url
        /// Docs: https://sandbox.vnpayment.vn/apis/docs/thanh-toan-pay/pay.html#tao-url-thanh-toan
        /// </summary>
        /// <param name="order"></param>
        /// <param name="locale"></param>
        /// <param name="returnUrl"></param>
        /// <returns>string: payment url</returns>
        Task<string> CreatePaymentUrlAsync(VNPayOrderInfoModel order);


        /// <summary>
        /// Query payment status
        /// Docs: https://sandbox.vnpayment.vn/apis/docs/thanh-toan-pay/pay.html#truy-van-ket-qua-thanh-toan-PAY
        /// </summary>
        /// <param name="orderId"></param>
        /// <param name="orderInfo"></param>
        /// <param name="transDate"></param>
        /// <param name="createDate"></param>
        /// <returns></returns>
        public Task<VNPayQueryPaymentStatusResponse> QueryAsync(string orderId, string orderInfo, string transDate, string createDate);

        /// <summary>
        /// Refund
        /// Docs: https://sandbox.vnpayment.vn/apis/docs/thanh-toan-pay/pay.html#hoan-tien-thanh-toan-PAY
        /// </summary>
        /// <param name="orderId"></param>
        /// <param name="amount"></param>
        /// <param name="orderInfo"></param>
        /// <param name="transDate"></param>
        /// <param name="transactionType"></param>
        /// <param name="createBy"></param>
        /// <param name="createDate"></param>
        /// <returns></returns>
        public Task<VNPayRefundResponseModel> RefundAsync(VNPayRefundRequestModel vNPayRefundModel);

        /// <summary>
        /// This method is used to verify the VNPAY signature.
        /// </summary>
        /// <param name="inputHash">The value from the URL parameter vnp_SecureHash.</param>
        /// <returns></returns>
        bool ValidateSignature(IQueryCollection vnpayData, string inputHash);
    }
}
