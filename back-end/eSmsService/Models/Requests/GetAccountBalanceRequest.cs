namespace eSmsService.Models.Requests
{
    public class GetAccountBalanceRequest : BaseRequestModel
    {
        public GetAccountBalanceRequest()
        {

        }
        public GetAccountBalanceRequest(string apiKey, string secretKey) : base(apiKey, secretKey)
        {
        }
    }
}