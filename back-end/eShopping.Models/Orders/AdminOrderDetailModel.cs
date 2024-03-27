using eShopping.Domain.Enums;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;

namespace eShopping.Models.Orders
{
    public class AdminOrderDetailModel
    {
        public Guid Id { get; set; }

        public Guid? CustomerId { get; set; }

        public string Code { get; set; }

        public EnumOrderStatus Status { get; set; }

        public string StatusName { get { return Status.GetName(); } }

        public string Reason { get; set; }

        [Precision(18, 2)]
        public decimal TotalPriceOrigin { get; set; }

        [Precision(18, 2)]
        public decimal TotalPriceValue { get; set; }

        [Precision(18, 2)]
        public decimal TotalPriceDiscount { get; set; }

        public decimal TotalPrice { get; set; }

        [Precision(18, 2)]
        public decimal DeliveryFee { get; set; }

        [Precision(18, 2)]
        public decimal TotalAmount { get; set; }

        public decimal Profit { get; set; }

        public DateTime? CreatedTime { get; set; }

        public Guid? CreatedUser { get; set; }

        public Guid? LastSavedUser { get; set; }

        public string ShipName { set; get; }

        public string ShipAddress { set; get; }

        public string ShipEmail { set; get; }

        public string ShipPhoneNumber { set; get; }

        public int? ShipCityId { get; set; }

        public int? ShipDistrictId { get; set; }

        public int? ShipWardId { get; set; }

        public CustomerDto Customer { get; set; }

        public string Note { get; set; }

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
