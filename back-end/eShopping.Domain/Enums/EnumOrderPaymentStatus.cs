
namespace eShopping.Domain.Enums
{
    public enum EnumOrderPaymentStatus
    {
        /// <summary>
        /// The order payment status is Unpaid
        /// </summary>
        Unpaid = 0,

        /// <summary>
        /// The order payment status is Paid
        /// </summary>
        Paid = 1,

        /// <summary>
        /// The order payment status is Refunded
        /// </summary>
        Refunded = 2,

        /// <summary>
        /// The order payment status is Waiting for refund
        /// </summary>
        WaitingForRefund = 3,


        /// <summary>
        /// The order payment transfer successfully and waiting for confirm
        /// </summary>
        WaitingForConfirm = 4,
    }

    public static class EnumOrderPaymentStatusExtensions
    {
        public static string GetName(this EnumOrderPaymentStatus enums) => enums switch
        {
            EnumOrderPaymentStatus.Unpaid => "Unpaid",
            EnumOrderPaymentStatus.Paid => "Paid",
            EnumOrderPaymentStatus.Refunded => "Refunded",
            EnumOrderPaymentStatus.WaitingForRefund => "Waiting for refund",
            _ => string.Empty
        };

        public static string GetNameTranslate(this EnumOrderPaymentStatus enums) => enums switch
        {
            EnumOrderPaymentStatus.Unpaid => "posOrder.detail.unpaid",
            EnumOrderPaymentStatus.Paid => "posOrder.detail.paid",
            EnumOrderPaymentStatus.Refunded => "posOrder.detail.returned",
            EnumOrderPaymentStatus.WaitingForRefund => "posOrder.detail.waitingForRefund",
            _ => string.Empty
        };
    }
}
