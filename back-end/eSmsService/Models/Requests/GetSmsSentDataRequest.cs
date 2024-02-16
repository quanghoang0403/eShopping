using eSmsService.Models.Enums;
using System;

namespace eSmsService.Models.Requests
{
    public class GetSmsSentDataRequest : BaseRequestModel
    {
        public GetSmsSentDataRequest(string apiKey, string secretKey, DateTime from, DateTime to)
            : base(apiKey, secretKey)
        {
            From = from;
            To = to;
        }

        public DateTime From { get; set; } 

        public DateTime To { get; set; }
    }
}