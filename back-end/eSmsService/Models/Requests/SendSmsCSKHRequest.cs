using eSmsService.Models.Enums;

namespace eSmsService.Models.Requests
{
    public class SendSmsCSKHRequest : SendSmsBaseRequest
    {
        public SendSmsCSKHRequest(string apiKey, string secretKey, int sanbox, string content, string callbackUrl, string phone, string brandname, int isUnicode, string requestId)
            : base(apiKey, secretKey, EnumEsmsSmsType.CSKH, sanbox, content, callbackUrl)
        {
            Phone = phone;
            Brandname = brandname;
            IsUnicode = isUnicode;
            RequestId = requestId;
        }

        public string Brandname { get; set; } = null;

        public string Phone { get; set; }

        public string RequestId { get; set; }

        public int IsUnicode { get; set; } = 0;
    }
}