namespace eSmsService.Models.Responses
{
    public class SmsSentStatus
    {
        public string CodeResponse { get; set; }
        public string SMSID { get; set; }
        public int SendFailed { get; set; }
        public int SendStatus { get; set; }
        public int SendSuccess { get; set; }
        public float TotalPrice { get; set; }
        public int TotalReceiver { get; set; }
        public int TotalSent { get; set; }
    }
}