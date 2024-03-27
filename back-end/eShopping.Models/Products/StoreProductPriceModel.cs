using Microsoft.EntityFrameworkCore;
using System;

namespace eShopping.Models.Products
{
    public class StoreProductPriceModel
    {
        public Guid? Id { get; set; }

        public string PriceName { get; set; }

        [Precision(18, 2)]
        public decimal PriceValue { set; get; }

        [Precision(18, 2)]
        public decimal? PriceDiscount { set; get; }

        public float? PercentNumber { set; get; }

        public int QuantityLeft { get; set; }

        public string Thumbnail { get; set; }
    }
}
