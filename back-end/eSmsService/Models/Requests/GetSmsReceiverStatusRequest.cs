using eSmsService.Models.Enums;
using System;

namespace eSmsService.Models.Requests
{
    public class GetSmsReceiverStatusRequest : BaseRequestModel
    {
        public GetSmsReceiverStatusRequest(string apiKey, string secretKey, string refId)
            : base(apiKey, secretKey)
        {
            RefId = refId;
        }

        public string RefId { get; set; } 
    }
}