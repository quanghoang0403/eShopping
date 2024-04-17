using System.ComponentModel;

namespace eShopping.Domain.Enums
{
    public enum EnumTransactionType
    {
        [Description("Payment")]
        Payment,

        [Description("Refund")]
        Refund,
    }
}
