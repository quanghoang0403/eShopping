using eShopping.Domain.Enums;
using Microsoft.EntityFrameworkCore;
using System;

namespace eShopping.Models.Orders
{
    public class StoreOrderModel
    {
        public Guid Id { get; set; }

        public string Code { get; set; }

        public EnumOrderStatus Status { get; set; }

        public string StatusName { get { return Status.GetName(); } }

        [Precision(18, 2)]
        public decimal TotalAmount { get; set; }

        public int TotalQuantity { get; set; }

        public DateTime? CreatedTime { get; set; }

        public string ShipFullAddress { get; set; }
    }
}
