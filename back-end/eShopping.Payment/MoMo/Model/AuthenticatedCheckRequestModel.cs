namespace eShopping.Payment.MoMo.Model
{
    public class AuthenticatedCheckRequestModel
    {
        public string PartnerCode { get; set; }

        public string AccessKey { get; set; }

        public string SecretKey { get; set; }
    }

    public class AuthenticatedCheckResponseModel
    {
        public bool IsSuccess { get; set; }
        public string Message { get; set; }
    }
}
