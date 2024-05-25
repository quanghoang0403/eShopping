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

        public DateTime CreatedTime { get; set; }


        public string ShipFullAddress { get; set; }

        public string StatusName { get { return Status.GetName(); } }

        public int TotalQuantity { get; set; }

        
        public decimal DeliveryFee { get; set; }

        
        public decimal TotalPriceValue { get; set; }

        
        public decimal TotalAmount { get; set; }

        public OrderItemDto OrderItems { get; set; }

        public class OrderItemDto
        {
            public int Quantity { get; set; }

            public int ProductVariantName { get; set; }

            public string Thumbnail { get; set; }
        }
    }
}
