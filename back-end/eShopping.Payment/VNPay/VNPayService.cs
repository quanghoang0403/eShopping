﻿using eShopping.Common.Constants;
using eShopping.Common.Extensions;
using eShopping.Domain.Settings;
using eShopping.Payment.VNPay.Model;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using System;
using System.IO;
using System.Net;
using System.Threading.Tasks;

namespace eShopping.Payment.VNPay
{
    public class VNPayService : IVNPayService
    {
        private readonly AppSettings _appSettings;
        private readonly VNPaySettings _vnPaySettings;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public VNPayService(
            IOptions<AppSettings> appSettings,
            IHttpContextAccessor httpContextAccessor)
        {
            _appSettings = appSettings.Value;
            _vnPaySettings = _appSettings.PaymentSettings.VNPaySettings;
            _httpContextAccessor = httpContextAccessor;
        }

        /// <summary>
        /// Create VNPAY payment url
        /// Docs: https://sandbox.vnpayment.vn/apis/docs/thanh-toan-pay/pay.html
        /// </summary>
        /// <param name="config"></param>
        /// <param name="order"></param>
        /// <param name="locale"></param>
        /// <returns>string: payment url</returns>
        public Task<string> CreatePaymentUrlAsync(VNPayOrderInfoModel order)
        {
            /// VNPay configs
            string vnpEndPoint = _vnPaySettings.VNPayUrl;
            string vnpTerminalId = _vnPaySettings.TerminalId;
            string vnpHashSecret = _vnPaySettings.SecretKey;

            /// VNPay config validation
            if (string.IsNullOrEmpty(vnpTerminalId) || string.IsNullOrEmpty(vnpHashSecret))
            {
                return Task.FromResult(string.Empty);
            }

            /// Build URL for VNPAY
            var vnpay = new VNPayLibrary();
            vnpay.AddRequestData("vnp_Version", _vnPaySettings.VNPayVersion);
            vnpay.AddRequestData("vnp_Command", "pay");
            vnpay.AddRequestData("vnp_TmnCode", vnpTerminalId);

            /// Payment amount. Amount does not carry decimal separators, thousandths, currency characters. To send a payment amount of 100,000 VND (one hundred thousand VND), merchant needs to multiply 100 times (decimal), then send to VNPAY: 100 000 00
            /// Số tiền thanh toán. Số tiền không mang các ký tự phân tách thập phân, phần nghìn, ký tự tiền tệ. Để gửi số tiền thanh toán là 100,000 VND (một trăm nghìn VNĐ) thì merchant cần nhân thêm 100 lần (khử phần thập phân), sau đó gửi sang VNPAY là: 100 000 00
            vnpay.AddRequestData("vnp_Amount", (Convert.ToInt64(order.Amount) * 100).ToString());
            if (!string.IsNullOrEmpty(order.BankCode))
            {
                vnpay.AddRequestData("vnp_BankCode", order.BankCode);
            }

            /// Follow docs here: https://docs.microsoft.com/en-us/windows-hardware/manufacture/desktop/default-time-zones?view=windows-11#time-zones
            TimeZoneInfo tzi = TimeZoneInfo.FindSystemTimeZoneById(TimeZoneConstants.AsiaStandardTimeCode);
            var vnpayDateTime = TimeZoneInfo.ConvertTimeFromUtc(order.CreatedDate, tzi);
            string dateTimeString = vnpayDateTime.VnPayFormatDate();

            vnpay.AddRequestData("vnp_CreateDate", dateTimeString);
            order.ReturnUrl = string.Format(order.ReturnUrl, dateTimeString);

            vnpay.AddRequestData("vnp_CurrCode", order.CurrencyCode);

            var ipAddress = _httpContextAccessor.HttpContext.Connection.RemoteIpAddress.ToString();
            vnpay.AddRequestData("vnp_IpAddr", ipAddress);
            if (!order.Locale.Equals("vn") || string.IsNullOrEmpty(order.Locale))
            {
                order.Locale = "en";
            }
            vnpay.AddRequestData("vnp_Locale", order.Locale);
            vnpay.AddRequestData("vnp_OrderInfo", order.Title);
            vnpay.AddRequestData("vnp_OrderType", "other"); /// default value: other
            vnpay.AddRequestData("vnp_ReturnUrl", order.ReturnUrl);
            vnpay.AddRequestData("vnp_TxnRef", order.OrderCode.ToString());

            // Add Params of 2.1.0 Version
            var paymentExpireDate = vnpayDateTime.AddMinutes(15).ToString("yyyyMMddHHmmss");
            vnpay.AddRequestData("vnp_ExpireDate", paymentExpireDate);

            #region Bill and Invoice

            /// Add Params of 2.1.0 Version
            //vnpay.AddRequestData("vnp_ExpireDate", txtExpire.Text);

            /// Billing (Thông tin hóa đơn)
            //vnpay.AddRequestData("vnp_Bill_Mobile", "");
            //vnpay.AddRequestData("vnp_Bill_Email", "");
            //var fullName = "";
            //if (!String.IsNullOrEmpty(fullName))
            //{
            //    var indexof = fullName.IndexOf(' ');
            //    vnpay.AddRequestData("vnp_Bill_FirstName", fullName.Substring(0, indexof));
            //    vnpay.AddRequestData("vnp_Bill_LastName", fullName.Substring(indexof + 1, fullName.Length - indexof - 1));
            //}
            //vnpay.AddRequestData("vnp_Bill_Address", "");
            //vnpay.AddRequestData("vnp_Bill_City", "");
            //vnpay.AddRequestData("vnp_Bill_Country", "");
            //vnpay.AddRequestData("vnp_Bill_State", "");

            /// Invoice (thông tin hóa đơn điện tử)
            //vnpay.AddRequestData("vnp_Inv_Phone", ""); /// Mobile phone number
            //vnpay.AddRequestData("vnp_Inv_Email", ""); /// Địa chỉ email
            //vnpay.AddRequestData("vnp_Inv_Customer", ""); /// Tên khách hàng
            //vnpay.AddRequestData("vnp_Inv_Address", ""); /// Địa chỉ công ty
            //vnpay.AddRequestData("vnp_Inv_Company", ""); /// Tên tổ chứ
            //vnpay.AddRequestData("vnp_Inv_Taxcode", ""); /// Mã số thuế
            //vnpay.AddRequestData("vnp_Inv_Type", ""); /// Loại thanh toán I: Cá nhân, O: Tổ chức

            #endregion

            string paymentUrl = vnpay.CreateRequestUrl(vnpEndPoint, vnpHashSecret);

            return Task.FromResult(paymentUrl);
        }

        /// <summary>
        /// Query payment status
        /// Docs: https://sandbox.vnpayment.vn/apis/docs/thanh-toan-pay/pay.html#truy-van-ket-qua-thanh-toan-PAY
        /// </summary>
        /// <param name="config"></param>
        /// <param name="orderInfo"></param>
        /// <returns></returns>
        public Task<VNPayQueryPaymentStatusResponse> QueryAsync(
            string orderId,
            string orderInfo,
            string transDate,
            string createDate
            )
        {
            var vnpayEndPoint = _vnPaySettings.BaseUrl;
            var vnpHashSecret = _vnPaySettings.SecretKey;
            var vnpTmnCode = _vnPaySettings.TerminalId;

            /// Build URL for VNPAY
            var vnpay = new VNPayLibrary();
            vnpay.AddRequestData("vnp_Version", _vnPaySettings.VNPayVersion);
            vnpay.AddRequestData("vnp_Command", "querydr");
            vnpay.AddRequestData("vnp_TmnCode", vnpTmnCode);
            vnpay.AddRequestData("vnp_TxnRef", orderId);
            vnpay.AddRequestData("vnp_OrderInfo", orderInfo);
            vnpay.AddRequestData("vnp_TransDate", transDate);
            vnpay.AddRequestData("vnp_CreateDate", createDate);
            var ipAddress = _httpContextAccessor.HttpContext.Connection.RemoteIpAddress.ToString();
            vnpay.AddRequestData("vnp_IpAddr", ipAddress);

            var queryDr = vnpay.CreateRequestUrl(vnpayEndPoint, vnpHashSecret);
            var request = (HttpWebRequest)WebRequest.Create(queryDr);
            request.AutomaticDecompression = DecompressionMethods.GZip;

            using var httpWebResponse = (HttpWebResponse)request.GetResponse();
            using var stream = httpWebResponse.GetResponseStream();
            if (stream != null)
            {
                using var reader = new StreamReader(stream);
                var strDatax = reader.ReadToEnd();

                /// convert query string to json object
                var json = strDatax.ParseQueryStringToJson();
                var response = new VNPayQueryPaymentStatusResponse(json);

                return Task.FromResult(response);
            }
            else
            {
                return Task.FromResult(new VNPayQueryPaymentStatusResponse());
            }
        }

        /// <summary>
        /// Refund
        /// Docs: https://sandbox.vnpayment.vn/apis/docs/truy-van-hoan-tien/querydr&refund.html#hoan-tien-thanh-toan-PAY
        /// </summary>
        /// <param name="config"></param>
        /// <param name="orderId"></param>
        /// <param name="amount"></param>
        /// <param name="orderInfo"></param>
        /// <param name="transDate"></param>
        /// <param name="transactionType"></param>
        /// <param name="createBy"></param>
        /// <param name="createDate"></param>
        /// <returns></returns>
        public Task<VNPayRefundResponseModel> RefundAsync(VNPayRefundRequestModel vnPayRefundModel)
        {
            var vnpayEndPoint = _vnPaySettings.BaseUrl;
            var vnpHashSecret = _vnPaySettings.SecretKey;
            var vnpTmnCode = _vnPaySettings.TerminalId;

            var vnpay = new VNPayLibrary();
            vnpay.AddRequestData("vnp_RequestId", $"{vnPayRefundModel.RequestId}");
            vnpay.AddRequestData("vnp_Version", _vnPaySettings.VNPayVersion);
            vnpay.AddRequestData("vnp_Command", "refund");
            vnpay.AddRequestData("vnp_TmnCode", vnpTmnCode);
            vnpay.AddRequestData("vnp_TransactionType", vnPayRefundModel.TransactionType);
            vnpay.AddRequestData("vnp_TxnRef", $"{vnPayRefundModel.TransactionId}");
            vnpay.AddRequestData("vnp_Amount", $"{vnPayRefundModel.Amount}");
            vnpay.AddRequestData("vnp_OrderInfo", $"{vnPayRefundModel.OrderInfo}");
            vnpay.AddRequestData("vnp_TransactionNo", $"{vnPayRefundModel.TransactionNo}");
            vnpay.AddRequestData("vnp_TransactionDate", $"{vnPayRefundModel.VnPayCreateDate}");
            vnpay.AddRequestData("vnp_CreateBy", $"{vnPayRefundModel.CreateBy}");
            vnpay.AddRequestData("vnp_CreateDate", $"{vnPayRefundModel.VnPayCreateDate}");

            var ipAddress = _httpContextAccessor.HttpContext.Connection.LocalIpAddress.ToString();
            vnpay.AddRequestData("vnp_IpAddr", ipAddress);

            var query_VNPAY = vnpay.CreateRequestUrl(vnpayEndPoint, vnpHashSecret);
            var request = (HttpWebRequest)WebRequest.Create(query_VNPAY);
            request.AutomaticDecompression = DecompressionMethods.GZip;

            using var httpWebResponse = (HttpWebResponse)request.GetResponse();
            using var stream = httpWebResponse.GetResponseStream();
            if (stream != null)
            {
                using var reader = new StreamReader(stream);
                var strData = reader.ReadToEnd();

                /// convert query string to json object
                var json = strData.ParseQueryStringToJson();

                var vnPayRefundResponseModel = JsonConvert.DeserializeObject<VNPayRefundResponseModel>(json);
                vnPayRefundResponseModel.vnp_URL = query_VNPAY;

                return Task.FromResult(vnPayRefundResponseModel);
            }

            return Task.FromResult(new VNPayRefundResponseModel());
        }

        /// <summary>
        /// This method is used to verify the VNPAY signature.
        /// </summary>
        /// <param name="inputHash">The value from the URL parameter vnp_SecureHash.</param
        /// <returns></returns>
        public bool ValidateSignature(IQueryCollection vnpayData, string inputHash)
        {
            var vnpay = new VNPayLibrary();

            foreach (var aParameter in vnpayData)
            {
                if (!string.IsNullOrEmpty(aParameter.Key) && aParameter.Key.StartsWith("vnp_"))
                {
                    vnpay.AddResponseData(aParameter.Key, aParameter.Value);
                }
            }

            return vnpay.ValidateSignature(inputHash, _vnPaySettings.SecretKey);
        }
    }
}
