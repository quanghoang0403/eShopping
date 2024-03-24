using Microsoft.EntityFrameworkCore;
using System;

namespace eShopping.Models.Products
{
    public class AdminProductPriceModel
    {
        public Guid? Id { get; set; }

        public string PriceName { get; set; }

        [Precision(18, 2)]
        public decimal OriginalPrice { set; get; }

        [Precision(18, 2)]
        public decimal PriceValue { set; get; }

        public int QuantityLeft { get; set; }

        public int QuantitySold { get; set; }

        public int Priority { get; set; }

        public string Thumbnail { get; set; }
    }
}
