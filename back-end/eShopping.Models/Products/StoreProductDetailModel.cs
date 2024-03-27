using eShopping.Models.Commons;
using System.Collections.Generic;

namespace eShopping.Models.Products
{
    public class StoreProductDetailModel : SEOModel
    {
        public int Code { get; set; }

        public bool? IsFeatured { get; set; }

        public int Priority { set; get; }

        public List<string> Gallery { set; get; }

        public StoreProductCategoryModel ProductCategory { get; set; }

        public List<StoreProductPriceModel> ProductPrices { get; set; }
    }
}
