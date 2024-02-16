using eSmsService.Models.Enums;

namespace eSmsService.Models.Requests
{
    public class SendSmsAdsRequest : SendSmsBaseRequest
    {
        public SendSmsAdsRequest(string apiKey, string secretKey, int sanbox, string content, string callbackUrl, string[] phones, string brandname)
            : base(apiKey, secretKey, EnumEsmsSmsType.Advertisement, sanbox, content, callbackUrl)
        {
            Phones = phones;
            Brandname = brandname;
        }

        public string Brandname { get; set; }
        public string[] Phones { get; set; }
    }
}