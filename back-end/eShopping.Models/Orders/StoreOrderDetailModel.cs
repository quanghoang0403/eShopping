using eShopping.Domain.Enums;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;

namespace eShopping.Models.Orders
{
    public class StoreOrderDetailModel
    {
        public Guid Id { get; set; }

        public DateTime CreatedTime { get; set; }

        public string Code { get; set; }

        public EnumOrderStatus Status { get; set; }

        public string StatusName { get { return Status.GetName(); } }

        public string ShipName { set; get; }

        public string ShipFullAddress { set; get; }

        public string ShipEmail { set; get; }

        public string ShipPhoneNumber { set; get; }

        public string Note { get; set; }

        public string Reason { get; set; }


        public decimal DeliveryFee { get; set; }


        public decimal TotalPriceOrigin { get; set; }


        public decimal TotalPrice { get; set; }


        public decimal TotalAmount { get; set; }

        public IEnumerable<StoreOrderItemModel> OrderItems { get; set; }
        public int? ShipCityId { get; set; }

        public int? ShipDistrictId { get; set; }

        public int? ShipWardId { get; set; }
    }
}
