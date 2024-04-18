namespace eShopping.Payment.MoMo.Model
{
    public class MomoPaymentResponse
    {
        #region Only show if ResultCode != 0
        public long ResponseTime { get; set; }

        public string Message { get; set; }

        public int ResultCode { get; set; }
        #endregion


        public long TransId { get; set; }

        public long Amount { get; set; }

        public string OrderId { get; set; }

        public string RequestId { get; set; }

        public string PartnerCode { get; set; }
    }
}
