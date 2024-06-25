using eShopping.Domain.Enums;
using System.Collections.Generic;

namespace eShopping.Common.Constants
{
    public class HubConnectionConstants
    {
        public const string OrderHub = "/orderHub";
    }

    public class OrderHubConstants
    {
        public const string RECEIVE_ORDER = "ReceiveOrder";
        public const string UPDATE_STATUS_BY_CUSTOMER = "UpdateStatusByCustomer";
        public const string UPDATE_ORDER_BY_CUSTOMER = "UpdateOrderByCustomer";

        public const string UPDATE_STATUS_BY_STAFF = "UpdateStatusByStaff";
        public const string UPDATE_ORDER_BY_STAFF = "UpdateOrderByStaff";
    }
}