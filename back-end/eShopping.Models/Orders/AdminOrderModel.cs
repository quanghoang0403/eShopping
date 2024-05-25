using eShopping.Domain.Enums;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;

namespace eShopping.Models.Orders
{
    public class AdminOrderModel
    {
        public Guid Id { get; set; }

        public Guid CustomerId { get; set; }

        public string Code { get; set; }

        public EnumOrderStatus Status { get; set; }

        public string StatusName { get { return Status.GetName(); } }

        public EnumPaymentMethod PaymentMethodId { get; set; }

        public string PaymentMethodName { get { return PaymentMethodId.GetName(); } }

        public EnumOrderPaymentStatus OrderPaymentStatusId { get; set; }

        public string OrderPaymentStatusName { get { return OrderPaymentStatusId.GetName(); } }

        public int TotalQuantity { get; set; }

        
        public decimal DeliveryFee { get; set; }

        
        public decimal TotalPriceOrigin { get; set; }

        
        public decimal TotalPriceValue { get; set; }

        
        public decimal TotalPriceDiscount { get; set; }

        
        public decimal TotalPrice { get; set; }

        
        public decimal TotalAmount { get; set; }
        public string ShipAddress { get; set; }

        public decimal Profit { get; set; }

        public CustomerDto Customer { get; set; }
        public DateTime? CreatedTime { get; set; }
        public class CustomerDto
        {
            public Guid Id { get; set; }

            public string FullName { get; set; }

            public string PhoneNumber { get; set; }

        }

        public Guid PlatformId { get; set; }

        public List<AdminOrderItemModel> OrderItems { get; set; }
    }
}
