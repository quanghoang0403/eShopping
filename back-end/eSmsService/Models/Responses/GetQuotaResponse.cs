using System.Collections.Generic;

namespace eSmsService.Models.Responses
{
    public class GetQuotaResponse
    {
        public GetQuotaResponse()
        {
        }

        public GetQuotaResponse(string codeResult, string errorMessage, int dailyQuota, int remainingQuota)
        {
            CodeResult = codeResult;
            ErrorMessage = errorMessage;
            DailyQuota = dailyQuota;
            RemainingQuota = remainingQuota;
        }

        public string CodeResult { get; set; }
        public string ErrorMessage { get; set; }
        public int DailyQuota { get; set; }
        public int RemainingQuota { get; set; }
    }
}