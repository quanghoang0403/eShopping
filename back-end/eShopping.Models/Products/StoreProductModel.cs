using eShopping.Domain.Base;
using eShopping.Domain.Enums;
using eShopping.Models.ProductCategories;
using System.Collections.Generic;

namespace eShopping.Models.Products
{
    public class StoreProductModel : SEOEntity
    {
        public int Code { get; set; }

        public string Thumbnail { set; get; }

        public decimal PriceValue { set; get; }

        public decimal? PriceDiscount { set; get; }

        public float? PercentNumber { set; get; }

        public bool? IsDiscount { get; set; }

        public bool? IsFeatured { get; set; }

        public bool? IsNewIn { get; set; }

        public bool? IsSoldOut { get; set; }

        public int Priority { set; get; }

        public List<string> Gallery { set; get; }

        public EnumGenderProduct GenderProduct { get; set; }

        public StoreProductCategoryModel ProductCategory { get; set; }

        public StoreProductCategoryModel ProductRootCategory { get; set; }

        public List<StoreProductSizeModel> ProductSizes { get; set; }

        public List<StoreProductVariantModel> ProductVariants { get; set; }

        public List<StoreProductStockModel> ProductStocks { get; set; }
    }
}
