using Microsoft.EntityFrameworkCore;
using System;

namespace eShopping.Models.Orders
{
    public class StoreOrderItemModel
    {
        public Guid Id { get; set; }

        public Guid OrderId { get; set; }

        public Guid ProductId { get; set; }

        public string ProductUrl { get; set; }

        public string ProductName { get; set; }

        public int Quantity { get; set; }

        public float? PercentNumber { get; set; }

        public string Thumbnail { get; set; }

        public string ProductVariantName { get; set; }

        public string ItemName { get; set; }

        
        public decimal PriceValue { get; set; }

        
        public decimal? PriceDiscount { get; set; }

        public decimal TotalPriceValue { get; set; }

        public decimal TotalPriceDiscount { get; set; }

        public decimal TotalPrice { get; set; }
    }
}
