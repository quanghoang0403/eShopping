namespace eShopping.Payment.MoMo.Model
{
    public class QueryStatusResponseModel
    {
        public bool IsSuccess { get { return ResultCode == 0; } }

        public string PartnerCode { get; set; }

        public string RequestId { get; set; }

        public string OrderId { get; set; }

        public string ExtraData { get; set; }

        public int Amount { get; set; }

        public long TransId { get; set; }

        public string PayType { get; set; }

        public int ResultCode { get; set; }

        public string Message { get; set; }

        public long ResponseTime { get; set; }
    }
}
