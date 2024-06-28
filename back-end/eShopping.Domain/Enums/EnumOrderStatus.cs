﻿namespace eShopping.Domain.Enums
{
    public enum EnumOrderStatus
    {
        /// <summary>
        /// New order, waiting for payment or not in order process
        /// </summary>
        New = 0,

        /// <summary>
        /// Order confirmed
        /// </summary>
        Confirmed = 1,

        /// <summary>
        /// Order on delivering
        /// </summary>
        Delivering = 2,

        /// <summary>
        /// Order completed
        /// </summary>
        Completed = 3,

        /// <summary>
        /// Order returned
        /// </summary>
        Returned = 4,

        /// <summary>
        /// Order canceled
        /// </summary>
        Canceled = 5,
    }

    public static class EnumOrderStatusExtensions
    {
        public static string GetName(this EnumOrderStatus enums) => enums switch
        {
            EnumOrderStatus.New => "New",
            EnumOrderStatus.Returned => "Returned",
            EnumOrderStatus.Canceled => "Canceled",
            EnumOrderStatus.Confirmed => "Confirmed",
            EnumOrderStatus.Delivering => "Delivering",
            EnumOrderStatus.Completed => "Completed",

            _ => string.Empty
        };

        public static string GetColor(this EnumOrderStatus enums) => enums switch
        {
            EnumOrderStatus.New => "#C3BDBD",
            EnumOrderStatus.Returned => "#858585",
            EnumOrderStatus.Canceled => "#FC0D1B",
            EnumOrderStatus.Confirmed => "#428BC1",
            EnumOrderStatus.Delivering => "#50429B",
            EnumOrderStatus.Completed => "#33B530",
            _ => string.Empty
        };

        public static string GetBackgroundColor(this EnumOrderStatus enums) => enums switch
        {
            EnumOrderStatus.New => "rgba(195, 189, 189, 0.1)",
            EnumOrderStatus.Returned => "rgba(195, 189, 189, 0.1)",
            EnumOrderStatus.Canceled => "rgba(252, 13, 27, 0.1)",
            EnumOrderStatus.Confirmed => "rgba(66, 139, 193, 0.1)",
            EnumOrderStatus.Delivering => "rgba(80, 66, 155, 0.1)",
            EnumOrderStatus.Completed => "rgba(51, 181, 48, 0.1)",
            _ => string.Empty
        };

        public static string GetNameTranslate(this EnumOrderStatus enums) => enums switch
        {
            EnumOrderStatus.New => "order.detail.new",
            EnumOrderStatus.Returned => "order.detail.returned",
            EnumOrderStatus.Canceled => "order.detail.canceled",
            EnumOrderStatus.Confirmed => "order.detail.confirmed",
            EnumOrderStatus.Delivering => "order.detail.delivering",
            EnumOrderStatus.Completed => "order.detail.completed",
            _ => string.Empty
        };
    }
}
