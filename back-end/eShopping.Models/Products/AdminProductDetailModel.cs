using eShopping.Domain.Enums;
using eShopping.Models.Commons;
using System;
using System.Collections.Generic;

namespace eShopping.Models.Products
{
    public class AdminProductDetailModel : SEOModel
    {
        public int Code { get; set; }

        public int ViewCount { set; get; }

        public bool? IsFeatured { get; set; }

        public bool? IsDiscounted { get; set; }

        public EnumStatus Status { get; set; }

        public EnumGenderProduct GenderProduct { get; set; }

        public int Priority { set; get; }

        public string Thumbnail { set; get; }

        public Guid ProductRootCategoryId { get; set; }

        public Guid ProductCategoryId { get; set; }

        public Guid ProductSizeCategoryId { get; set; }

        public decimal PriceOriginal { set; get; }

        public decimal PriceValue { set; get; }

        public decimal? PriceDiscount { set; get; }

        public float? PercentNumber { get; set; }

        public DateTime? StartDate { get; set; }

        public DateTime? EndDate { get; set; }

        public List<AdminProductVariantWithStockModel> ProductVariants { get; set; }

        public List<AdminProductStockModel> ProductStocks { get; set; }

        public List<string> Gallery { get; set; }
    }
}
