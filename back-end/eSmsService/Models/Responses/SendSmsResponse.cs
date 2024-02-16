namespace eSmsService.Models.Responses
{
    public class SendSmsResponse : BaseSendSmsResponse
    {
        public int CountRegenerate { get; set; }

        public string SMSID { get; set; }
    }
}