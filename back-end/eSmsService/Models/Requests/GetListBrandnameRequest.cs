namespace eSmsService.Models.Requests
{
    public class GetListBrandnameRequest : BaseRequestModel
    {
        public GetListBrandnameRequest()
        {

        }
        public GetListBrandnameRequest(string apiKey, string secretKey) : base(apiKey, secretKey)
        {
        }
    }
}