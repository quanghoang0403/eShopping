using Microsoft.EntityFrameworkCore;
using System;

namespace eShopping.Models.Products
{
    public class AdminProductPriceModel
    {
        public Guid? Id { get; set; }

        public string PriceName { get; set; }

        [Precision(18, 2)]
        public decimal PriceOriginal { set; get; }

        [Precision(18, 2)]
        public decimal PriceValue { set; get; }

        [Precision(18, 2)]
        public decimal? PriceDiscount { set; get; }

        public float? PercentNumber { get; set; }

        public int QuantityLeft { get; set; }

        public int QuantitySold { get; set; }

        public DateTime StartDate { get; set; }

        public DateTime? EndDate { get; set; }

        public string Thumbnail { get; set; }
        public int Priority { get; set; }
    }
}
