using eShopping.Domain.Enums;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;

namespace eShopping.Models.Orders
{
    public class AdminOrderDetailModel
    {
        public Guid Id { get; set; }

        public Guid CustomerId { get; set; }

        public DateTime CreatedTime { get; set; }

        public string Code { get; set; }

        public EnumOrderStatus Status { get; set; }

        public string StatusName { get { return Status.GetName(); } }

        public EnumPaymentMethod PaymentMethodId { get; set; }

        public string PaymentMethodName { get { return PaymentMethodId.GetName(); } }

        public EnumOrderPaymentStatus OrderPaymentStatusId { get; set; }

        public string OrderPaymentStatusName { get { return OrderPaymentStatusId.GetName(); } }

        public string Reason { get; set; }

        public string ShipName { set; get; }

        public string ShipFullAddress { set; get; }

        public string ShipEmail { set; get; }

        public string ShipPhoneNumber { set; get; }

        public string Note { get; set; }

        public decimal TotalQuantity { get; set; }

        
        public decimal DeliveryFee { get; set; }

        
        public decimal TotalPriceOrigin { get; set; }

        
        public decimal TotalPrice { get; set; }

        
        public decimal TotalAmount { get; set; }

        public decimal Profit { get; set; }

        public CustomerDto Customer { get; set; }

        public IEnumerable<AdminOrderItemModel> OrderItems { get; set; }

        public class CustomerDto
        {
            public Guid Id { get; set; }

            public string FullName { get; set; }

            public string PhoneNumber { get; set; }

            public string Address { get; set; }
        }
    }
}
