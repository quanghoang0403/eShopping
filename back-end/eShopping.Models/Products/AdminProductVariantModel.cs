using System;

namespace eShopping.Models.Products
{
    public class AdminProductVariantModel
    {
        public Guid? Id { get; set; }

        public string ProductVariantName { get; set; }

        public decimal PriceOriginal { set; get; }

        public decimal PriceValue { set; get; }

        public decimal? PriceDiscount { set; get; }

        public float? PercentNumber { get; set; }

        public DateTime StartDate { get; set; }

        public DateTime? EndDate { get; set; }

        public string Thumbnail { get; set; }

        public int Priority { get; set; }
    }
}
