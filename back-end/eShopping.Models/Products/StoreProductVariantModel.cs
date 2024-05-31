using Microsoft.EntityFrameworkCore;
using System;

namespace eShopping.Models.Products
{
    public class StoreProductVariantModel
    {
        public Guid Id { get; set; }

        public string Name { get; set; }

        public decimal PriceValue { set; get; }

        public decimal? PriceDiscount { set; get; }

        public float? PercentNumber { set; get; }

        public string Thumbnail { get; set; }
    }
}
