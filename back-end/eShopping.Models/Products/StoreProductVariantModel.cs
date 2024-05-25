using Microsoft.EntityFrameworkCore;
using System;

namespace eShopping.Models.Products
{
    public class StoreProductVariantModel
    {
        public Guid? Id { get; set; }

        public string ProductVariantName { get; set; }

        
        public decimal PriceValue { set; get; }

        
        public decimal? PriceDiscount { set; get; }

        public float? PercentNumber { set; get; }

        public int QuantityLeft { get; set; }

        public string Thumbnail { get; set; }
    }
}
