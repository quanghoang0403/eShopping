namespace eSmsService.Models.Requests
{
    public class GetSummaryMultipleMessageRequest : BaseRequestModel
    {
        public GetSummaryMultipleMessageRequest(string apiKey, string secretKey, string brandname, string smsType, string phone, string content)
            : base(apiKey, secretKey)
        {
            Brandname = brandname;
            SmsType = smsType;
            Phone = phone;
            Content = content;
        }

        public string Brandname { get; set; }
        public string SmsType { get; set; }
        public string Phone { get; set; }
        public string Content { get; set; }
    }
}