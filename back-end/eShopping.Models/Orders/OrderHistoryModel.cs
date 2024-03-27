using eShopping.Domain.Enums;
using System;

namespace eShopping.Models.Orders
{
    public class OrderHistoryModel
    {
        public Guid Id { get; set; }

        public Guid? OrderId { get; set; }

        public EnumOrderActionType ActionType { get; set; }

        public string ActionName { get; set; }

        public string PerformedBy { get; set; }

        public string Note { get; set; }

        public DateTime? CreatedTime { get; set; }
    }
}
