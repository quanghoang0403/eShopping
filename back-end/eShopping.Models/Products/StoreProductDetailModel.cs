using eShopping.Domain.Enums;
using eShopping.Models.Commons;
using eShopping.Models.ProductCategories;
using System.Collections.Generic;

namespace eShopping.Models.Products
{
    public class StoreProductDetailModel : SEOModel
    {
        public int Code { get; set; }

        public bool? IsDiscount { get; set; }

        public bool? IsFeatured { get; set; }

        public bool? IsNewIn { get; set; }

        public bool? IsSoldOut { get; set; }

        public int Priority { set; get; }

        public string Thumbnail { set; get; }

        public List<string> Gallery { set; get; }

        public EnumGenderProduct GenderProduct { get; set; }

        public StoreProductCategoryModel ProductCategory { get; set; }

        public List<StoreProductVariantModel> ProductVariants { get; set; }
    }
}
