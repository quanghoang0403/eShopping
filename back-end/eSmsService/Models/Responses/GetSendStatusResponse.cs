using System.Collections.Generic;

namespace eSmsService.Models.Responses
{
    public class GetSendStatusResponse
    {
        public GetSendStatusResponse()
        {
        }

        public GetSendStatusResponse(string codeResponse, string smId, int sendFailed, int sendStatus, int sendSuccess, 
            float totalPrice, int totalReceiver, int totalSent)
        {
            CodeResponse = codeResponse;
            SMSID = smId;
            SendFailed = sendFailed;
            SendStatus = sendStatus;
            SendSuccess = sendSuccess;
            TotalPrice = totalPrice;
            TotalReceiver = totalReceiver;
            TotalSent = totalSent;
        }

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