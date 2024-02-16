using System.Collections.Generic;

namespace eSmsService.Models.Responses
{
    public class GetCallbackResponse
    {
        public GetCallbackResponse()
        {
        }

        public GetCallbackResponse(string code, string message, List<DataCallbackInfo> dataCallback)
        {
            Code = code;
            Message = message;
            Data_callback = dataCallback;
        }

        public string Code { get; set; }
        public string Message { get; set; }
        public List<DataCallbackInfo> Data_callback { get; set; }

        public class DataCallbackInfo
        {
            public string SMSID { get; set; }
            public int SendFailed { get; set; }
            public int SendSuccess { get; set; }
            public int SendStatus { get; set; }
            public float TotalPrice { get; set; }
            public int TotalReceiver { get; set; }
            public int TotalSent { get; set; }
            public int RequestId { get; set; }
            public int TypeId { get; set; }
            public int Telcoid { get; set; }
            public string PhoneNumber { get; set; }
            public string CallbackUrl { get; set; }
            public string Partnerids { get; set; }
            public string ErrorInfo { get; set; }
            public string OAId { get; set; }
            public string ZnsTempId { get; set; }
        }
    }
}