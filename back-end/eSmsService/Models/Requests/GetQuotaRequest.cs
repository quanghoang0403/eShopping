using eSmsService.Models.Enums;
using System;

namespace eSmsService.Models.Requests
{
    public class GetQuotaRequest : BaseRequestModel
    {
        public GetQuotaRequest(string apiKey, string secretKey, string oaId)
            : base(apiKey, secretKey)
        {
            OAID = oaId;
        }

        public string OAID { get; set; }
    }
}