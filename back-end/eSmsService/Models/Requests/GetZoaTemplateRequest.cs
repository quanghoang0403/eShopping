using eSmsService.Models.Enums;
using System;

namespace eSmsService.Models.Requests
{
    public class GetZoaTemplateRequest : BaseRequestModel
    {
        public GetZoaTemplateRequest(string apiKey, string secretKey, string oaId, string smsType)
            : base(apiKey, secretKey)
        {
            OAId = oaId;
            SmsType = smsType;
        }

        public string OAId { get; set; }
        public string SmsType { get; set; }
    }
}