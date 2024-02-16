using System.Collections.Generic;

namespace eSmsService.Models.Responses
{
    public class GetSmsReceiverByIdResponse
    {
        public GetSmsReceiverByIdResponse()
        {
        }

        public GetSmsReceiverByIdResponse(string codeResult, string errorMessage, List<Receiver> receiverList)
        {
            CodeResult = codeResult;
            ErrorMessage = errorMessage;
            ReceiverList = receiverList;
        }

        public string CodeResult { get; set; }

        public List<Receiver> ReceiverList { get; set; }

        public string ErrorMessage { get; set; }

        public class Receiver
        {
            public bool IsSent { get; set; }
            public string NetworkName { get; set; }
            public string Phone { get; set; }
            public int Retry { get; set; }
            public bool SentResult { get; set; }
        }
    }
}