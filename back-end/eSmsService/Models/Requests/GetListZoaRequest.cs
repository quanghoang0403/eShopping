namespace eSmsService.Models.Requests
{
    public class GetListZoaRequest : BaseRequestModel
    {
        public GetListZoaRequest()
        {

        }
        public GetListZoaRequest(string apiKey, string secretKey) : base(apiKey, secretKey)
        {
        }
    }
}