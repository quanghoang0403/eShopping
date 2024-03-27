using Microsoft.EntityFrameworkCore;
using System;

namespace eShopping.Models.Products
{
    public class StoreCartModel
    {
        public Guid ProductId { get; set; }

        public Guid PriceId { get; set; }

        public string ProductName { get; set; }

        public string PriceName { get; set; }

        [Precision(18, 2)]
        public decimal PriceValue { set; get; }

        [Precision(18, 2)]
        public decimal? PriceDiscount { set; get; }

        public float? PercentNumber { set; get; }

        public int Quantity { get; set; }

        public string Thumbnail { get; set; }
    }
}
