using System.Collections.Generic;

namespace eSmsService.Models.Responses
{
    public class GetRatingResponse
    {
        public GetRatingResponse()
        {
        }

        public GetRatingResponse(string codeResult, string errorMessage, List<DataInfo> data, int total)
        {
            CodeResult = codeResult;
            ErrorMessage = errorMessage;
            Data = data;
            Total = total;
        }

        public string CodeResult { get; set; }
        public string ErrorMessage { get; set; }
        public List<DataInfo> Data { get; set; }
        public int Total { get; set; }

        public class DataInfo
        {
            public string[] Feedbacks { get; set; }
            public string msgId { get; set; }
            public string note { get; set; }
            public int rate { get; set; }
            public string submitDate { get; set; }
            public string trackingId { get; set; }
        }
    }
}