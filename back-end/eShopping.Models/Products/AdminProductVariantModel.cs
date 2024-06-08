using System;
using System.Collections.Generic;

namespace eShopping.Models.Products
{
    public class AdminProductVariantModel
    {
        public Guid? Id { get; set; }

        public string Name { get; set; }

        public decimal PriceOriginal { set; get; }

        public decimal PriceValue { set; get; }

        public decimal? PriceDiscount { set; get; }

        public float? PercentNumber { get; set; }

        public DateTime? StartDate { get; set; }

        public DateTime? EndDate { get; set; }

        public string Thumbnail { get; set; }

        public int Priority { get; set; }
    }

    public class AdminProductVariantWithStockModel : AdminProductVariantModel
    {
        public List<AdminProductVariantStockModel> Stocks { get; set; }
    }

    public class AdminProductVariantStockModel
    {
        public Guid ProductSizeId { get; set; }

        public int QuantityLeft { get; set; }
    }
}
