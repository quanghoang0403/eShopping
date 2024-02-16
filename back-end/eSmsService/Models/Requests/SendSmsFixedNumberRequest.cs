using eSmsService.Models.Enums;

namespace eSmsService.Models.Requests
{
    public class SendSmsFixedNumberRequest : SendSmsBaseRequest
    {
        public SendSmsFixedNumberRequest(string apiKey, string secretKey, int sanbox, string content, string phone, string callbackUrl, string requestId)
            : base(apiKey, secretKey, EnumEsmsSmsType.FixedNumber, sanbox, content, callbackUrl)
        {
            RequestId = requestId;
            Phone = phone;
            RequestId = requestId;
        }

        public string Phone { get; set; }
        public string RequestId { get; set; }
    }
}