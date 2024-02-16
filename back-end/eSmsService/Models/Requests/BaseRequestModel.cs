namespace eSmsService.Models.Requests
{
    public class BaseRequestModel
    {
        public BaseRequestModel()
        {
        }

        public BaseRequestModel(string apiKey, string secretKey)
        {
            ApiKey = apiKey;
            SecretKey = secretKey;
        }

        public string ApiKey { get; protected set; }
        public string SecretKey { get; protected set; }
    }
}