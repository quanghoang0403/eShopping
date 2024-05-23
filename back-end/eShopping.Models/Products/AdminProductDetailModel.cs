using eShopping.Domain.Enums;
using eShopping.Models.Commons;
using eShopping.Models.ProductCategories;
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

        public int Priority { set; get; }

        public string Thumbnail { set; get; }

        public AdminProductCategoryModel ProductCategory { get; set; }

        public IEnumerable<AdminProductPriceModel> ProductPrices { get; set; }

        public IEnumerable<AdminImageModel> Images { get; set; }
    }
}
