namespace eShopping.Payment.PayOS.Enums
{
    public class PayOSStatus
    {
        /// <summary>
        /// Đã thanh toán
        /// </summary>
        public const string PAID = "PAID";

        /// <summary>
        /// Chờ thanh toán
        /// </summary>
        public const string PENDING = "PENDING";

        /// <summary>
        /// Đang xử lý
        /// </summary>
        public const string PROCESSING = "PROCESSING";

        /// <summary>
        /// Đã hủy
        /// </summary>
        public const string CANCELLED = "CANCELLED";
    }
}
