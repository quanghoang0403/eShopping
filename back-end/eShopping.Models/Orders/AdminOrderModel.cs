using eShopping.Domain.Enums;
using System;
using System.Collections.Generic;

namespace eShopping.Models.Orders
{
    public class AdminOrderModel
    {
        public Guid Id { get; set; }

        public Guid? CustomerId { get; set; }

        public string Code { get; set; }

        public EnumOrderStatus Status { get; set; }

        public string StatusName { get { return Status.GetName(); } }

        public decimal PriceOriginal { get; set; }

        public decimal TotalDiscountAmount { get; set; }

        public decimal DeliveryFee { get; set; }

        public decimal TotalAmount { get { return PriceOriginal - TotalDiscountAmount + DeliveryFee; } }

        public CustomerDto Customer { get; set; }

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
