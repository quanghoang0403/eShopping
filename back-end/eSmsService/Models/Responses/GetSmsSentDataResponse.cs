using System.Collections.Generic;

namespace eSmsService.Models.Responses
{
    public class GetSmsSentDataResponse
    {
        public GetSmsSentDataResponse()
        {
        }

        public GetSmsSentDataResponse(string codeResult, string errorMessage, List<SendData> sentData)
        {
            CodeResult = codeResult;
            ErrorMessage = errorMessage;
            SentData = sentData;
        }

        public string CodeResult { get; set; }

        public string ErrorMessage { get; set; }

        public List<SendData> SentData { get; set; }

        public class SendData
        {
            public string Content { get; set; }

            public string Phone { get; set; }

            public string RefercenceId { get; set; }

            public float SellPrice { get; set; }

            public bool SentStatus { get; set; }

            public string SentTime { get; set; }

            public int SmsId { get; set; }

            public int SmsType { get; set; }
        }
    }
}