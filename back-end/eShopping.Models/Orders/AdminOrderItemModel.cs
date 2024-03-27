﻿using Microsoft.EntityFrameworkCore;
using System;

namespace eShopping.Models.Orders
{
    public class AdminOrderItemModel
    {
        public Guid Id { get; set; }

        public Guid? OrderId { get; set; }

        public Guid? ProductId { get; set; }

        public Guid? ProductPriceId { get; set; }

        public int Quantity { get; set; }

        public string ProductName { get; set; }

        public string PriceName { get; set; }

        public string ItemName { get; set; }

        [Precision(18, 2)]
        public decimal PriceOrigin { get; set; }

        [Precision(18, 2)]
        public decimal PriceValue { get; set; }

        [Precision(18, 2)]
        public decimal? PriceDiscount { get; set; }

        public decimal TotalPriceOrigin { get; set; }

        public decimal TotalPriceValue { get; set; }

        public decimal TotalPriceDiscount { get; set; }

        public decimal TotalPrice { get; set; }

        public decimal Profit { get; set; }
    }
}
