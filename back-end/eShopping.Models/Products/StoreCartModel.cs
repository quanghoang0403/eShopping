using System;

namespace eShopping.Models.Products
{
    public class StoreCartModel
    {
        public Guid ProductId { get; set; }

        public string ProductName { get; set; }

        public Guid ProductVariantId { get; set; }

        public string ProductVariantName { get; set; }

        public Guid ProductSizeId { get; set; }

        public string ProductSizeName { get; set; }

        public decimal PriceValue { set; get; }

        public decimal? PriceDiscount { set; get; }

        public float? PercentNumber { set; get; }

        public int Quantity { get; set; }

        public string Thumbnail { get; set; }

    }
}
