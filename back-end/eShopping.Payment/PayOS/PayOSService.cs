using eShopping.Domain.Settings;
using eShopping.Payment.PayOS.Model;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Net.payOS.Types;
using Net.payOS.Utils;
using Newtonsoft.Json.Linq;
using System.Threading.Tasks;

namespace eShopping.Payment.PayOS
{
    public class PayOSService : IPayOSService
    {
        private readonly Net.payOS.PayOS _payOS;
        private readonly ILogger<PayOSService> _logger;
        private readonly AppSettings _appSettings;
        private readonly PayOSSettings _payOSSettings;

        public PayOSService(ILogger<PayOSService> logger, IOptions<AppSettings> appSettings)
        {
            _appSettings = appSettings.Value;
            _payOSSettings = _appSettings.PaymentSettings.PayOSSettings;
            _payOS = new(_payOSSettings.ClientId, _payOSSettings.ApiKey, _payOSSettings.Checksum);
            _logger = logger;
        }

        public async Task<CreatePaymentResult> CreatePayment(CreatePaymentRequest request)
        {
            PaymentData paymentData = new PaymentData(request.OrderCode, request.Amount, request.Description, request.Items, request.CancelUrl, request.ReturnUrl);

            CreatePaymentResult createPayment = await _payOS.createPaymentLink(paymentData);

            return createPayment;
        }

        public async Task<PaymentLinkInformation> GetPaymentLinkInfomation(int orderId)
        {
            PaymentLinkInformation paymentLinkInformation = await _payOS.getPaymentLinkInfomation(orderId);
            return paymentLinkInformation;
        }

        public bool VerifySignature(WebhookData data, string signature)
        {
            var isValid = signature == SignatureControl.CreateSignatureFromObj(JObject.FromObject(data), _payOSSettings.Checksum);
            return isValid;
        }
    }
}
