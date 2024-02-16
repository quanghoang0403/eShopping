using eSmsService.Models.Enums;
using System;

namespace eSmsService.Models.Requests
{
    public class GetRatingRequest : BaseRequestModel
    {
        public GetRatingRequest(string apiKey, string secretKey
            , string oaId, string templateID
            , string fromTime, string toTime
            , string offset, string limit)
            : base(apiKey, secretKey)
        {
            OAId = oaId;
            TemplateID = templateID;
            FromTime = fromTime;
            ToTime = toTime;
            Offset = offset;
            Limit = limit;
        }

        public string OAId { get; set; }
        public string TemplateID { get; set; }
        public string FromTime { get; set; }
        public string ToTime { get; set; }
        public string Offset { get; set; }
        public string Limit { get; set; }
    }
}