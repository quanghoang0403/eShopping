using eShopping.Domain.Base;
using Microsoft.EntityFrameworkCore;
using System;

namespace eShopping.Models.Products
{
    public class StoreProductModel : SEOEntity
    {
        public int Code { get; set; }

        public string Thumbnail { get; set; }

        
        public decimal PriceValue { set; get; }

        
        public decimal? PriceDiscount { set; get; }

        public float? PercentNumber { set; get; }

        public bool? IsFeatured { get; set; }

        public bool? IsDiscount { get; set; }

        public bool? IsNewIn { get; set; }

        public bool? IsSoldOut { get; set; }
    }
}
