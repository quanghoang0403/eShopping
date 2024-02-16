using eSmsService.Models.Requests;
using eSmsService.Models.Responses;

using System.Threading.Tasks;

namespace eSmsService
{
    public interface IESmsService
    {
        Task<bool> IsValidApiSecretKey(string apiKey, string secretKey);

        Task<AccountBalance> GetAccountBalanceAsync(GetAccountBalanceRequest request);

        Task<SendSmsResponse> SendSMSAsync(SendSmsBaseRequest sendSmsRequest);

        Task<GetSmsSentDataResponse> GetSmsSentDataAsync(GetSmsSentDataRequest request);

        Task<GetSendStatusResponse> GetSendStatusAsync(GetSmsDetailByIdRequest request);

        Task<GetSmsReceiverByIdResponse> GetSmsReceiverStatusAsync(GetSmsReceiverStatusRequest request);

        Task<GetListBrandnameResponse> GetListBrandnameAsync(GetListBrandnameRequest request);

        Task<GetBrandnameTemplatesResponse> GetTemplateAsync(GetTemplateRequest request);

        Task<GetSummaryMultipleMessageResponse> GetSummaryMultipleMessageAsync(GetSummaryMultipleMessageRequest request);

        Task<GetListZoaResponse> GetListZoaAsync(GetListZoaRequest request);

        Task<GetZoaTemplateResponse> GetZoaTemplateAsync(GetZoaTemplateRequest request);

        Task<GetSummaryZaloMessageResponse> GetSummaryZaloMessageAsync(GetSummaryZaloMessageRequest request);

        Task<GetQuotaResponse> GetQuotaAsync(GetQuotaRequest request);

        Task<GetRatingResponse> GetRatingAsync(GetRatingRequest request);

        Task<GetCallbackResponse> GetCallbackAsync(GetCallbackRequest request);
    }
}