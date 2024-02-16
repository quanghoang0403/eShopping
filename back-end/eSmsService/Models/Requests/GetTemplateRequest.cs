using eSmsService.Models.Enums;
using System;

namespace eSmsService.Models.Requests
{
    public class GetTemplateRequest : BaseRequestModel
    {
        public GetTemplateRequest(string apiKey, string secretKey, string brandname, string smsType)
            : base(apiKey, secretKey)
        {
            Brandname = brandname;
            SmsType = smsType;
        }

        public string Brandname { get; set; }
        public string SmsType { get; set; }
    }
}