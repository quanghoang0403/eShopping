namespace eShopping.Domain.Enums
{
    public enum EnumOrderActionType
    {
        CREATE_ORDER = 0,

        EDIT_ORDER = 1,

        CANCEL = 2,

        // <summary>
        // Payment method will display on Note Column
        // </summary>
        PAID_SUCCESSFULLY = 3,

        // <summary>
        // Payment method will display on Note Column
        // </summary>
        PAID_FAILED = 4,

        PROCESSING = 5,

        COMPLETE = 6,

    }

    public static class EnumOrderActionTypeExtensions
    {
        public static string GetActionName(this EnumOrderActionType enums) => enums switch
        {
            EnumOrderActionType.CREATE_ORDER => "orderHistory.createOrder",
            EnumOrderActionType.EDIT_ORDER => "orderHistory.editOrder",
            EnumOrderActionType.CANCEL => "orderHistory.canceled",
            EnumOrderActionType.PAID_SUCCESSFULLY => "orderHistory.paidSuccess",
            EnumOrderActionType.PAID_FAILED => "orderHistory.paidFailed",
            EnumOrderActionType.PROCESSING => "orderHistory.processing",
            EnumOrderActionType.COMPLETE => "orderHistory.completed",
            _ => string.Empty
        };
    }
}
