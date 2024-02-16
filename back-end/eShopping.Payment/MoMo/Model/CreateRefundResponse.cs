namespace eShopping.Payment.MoMo.Model
{
    public class CreateRefundResponse
    {
        public string PartnerCode { get; set; }

        public string RequestId { get; set; }

        public string OrderId { get; set; }

        public long Amount { get; set; }

        public long TransId { get; set; }

        public int ResultCode { get; set; }

        /// <summary>
        /// Error description based on lang
        /// </summary>
        public string Message { get; set; }

        /// <summary>
        /// Time to respond payment results to partner
        /// </summary>
        public long ResponseTime { get; set; }
    }
}
