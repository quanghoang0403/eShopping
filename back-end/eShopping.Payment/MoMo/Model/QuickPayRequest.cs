using eShopping.Common.Constants;

namespace eShopping.Payment.MoMo.Model
{
    public class QuickPayRequest
    {
        /// <summary>
        /// Required
        /// Your business account’s unique identity
        /// </summary>
        public string PartnerCode { get; set; }
        /// <summary>
        /// Sub partner Id
        /// </summary>
        public string SubPartnerCode { get; set; }
        /// <summary>
        /// Store ID
        /// </summary>
        public string OrderId { get; set; }
        /// <summary>
        /// Required
        /// Amount needs to be paid
        /// Min: 1.000 VND
        /// Max: 50.000.000 VND
        /// Currency: VND
        /// Data type: Long
        /// </summary>
        public long Amount { get; set; }
        /// <summary>
        /// Required. Length(50)
        /// Request ID, unique for each request,
        /// MoMo's partner uses the requestId field for idempotency control
        /// </summary>
        public string RequestId { get; set; }
        /// <summary>
        /// Required
        /// Encrypt a String Payment code created from MoMo app that is scanned by cashier by RSA using public Key RSA Encryption
        /// </summary>
        public string PaymentCode { get; set; }
        /// <summary>
        /// Required
        /// Short information
        /// </summary>
        public string OrderInfo { get; set; }
        /// <summary>
        /// If set to false, the payment will not be automatically captured.
        /// Default is true
        /// </summary>
        public bool AutoCapture { get; set; } = true;
        /// <summary>
        /// Merchant’s API Endpoint. Used by MoMo to send payment results via IPN method (server-to-server)
        /// </summary>
        public string IpnUrl { get; set; }
        /// <summary>
        /// Required
        /// Default value is empty ""
        /// Encode base64 follow Jsonformat: {"key": "value"}
        /// Example with data: {"username": "momo"}=> data of extraData: eyJ1c2VybmFtZSI6ICJtb21vIn0=
        /// </summary>
        public string ExtraData { get; set; }
        /// <summary>
        /// List of products displayed on the payment page. Maximum: 50 items
        /// </summary>
        public string Items { get; set; }
        /// <summary>
        /// Info of the customer
        /// </summary>
        public object UserInfo { get; set; }
        /// <summary>
        /// Language of returned message (vi or en)
        /// </summary>
        public string Lang { get; set; } = SystemConstants.Locale;
        /// <summary>
        /// Signature to confirm information. Secure transaction in Hmac_SHA256  algorithm with format, a String sort all key name of data field from a-z:
        /// accessKey=$accessKey&amount=$amount&extraData=$extraData
        /// &orderId=$orderId&orderInfo=$orderInfo&partnerCode=$partnerCode
        /// &paymentCode=$paymentCode&requestId=$requestId
        /// </summary>
        public string Signature { get; set; }
    }
}
