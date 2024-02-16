using eSmsService.Models.Enums;

namespace eSmsService.Models.Requests
{
    public abstract class SendSmsBaseRequest : BaseRequestModel
    {
        public SendSmsBaseRequest()
        {
        }

        public SendSmsBaseRequest(string apiKey, string secretKey, EnumEsmsSmsType smsType, int sandbox, string content, string callbackUrl)
        {
            ApiKey = apiKey;
            SecretKey = secretKey;
            SmsType = smsType;
            SandBox = sandbox;
            Content = content;
            CallbackUrl = callbackUrl;
        }

        public void SetApiKey(string apiKey)
        {
            ApiKey = apiKey;
        }

        public void SetSecretKey(string secretKey)
        {
            SecretKey = secretKey;
        }

        public int SandBox { get; set; } = 1;

        public string Content { get; set; }

        public string CallbackUrl { get; set; }

        public EnumEsmsSmsType SmsType { get; set; } = EnumEsmsSmsType.CSKH;


    }
}