using eSmsService.Models.Enums;
using System;

namespace eSmsService.Models.Requests
{
    public class GetSummaryZaloMessageRequest : BaseRequestModel
    {
        public GetSummaryZaloMessageRequest(string apiKey, string secretKey, string phone, string[] valParams, string tempID, string oaID)
            : base(apiKey, secretKey)
        {
            Phone = phone;
            Params = valParams;
            TempID = tempID;
            OAID = oaID;
        }

        public string Phone { get; set; }
        public string[] Params { get; set; }

        public string TempID { get; set; }

        public string OAID { get; set; }
    }
}