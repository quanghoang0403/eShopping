using eShopping.Models.ProductCategories;
using System.Collections.Generic;

namespace eShopping.Models.Products
{
    public class AdminPreparedDataProductModel
    {
        public List<AdminProductSizeCategoryModel> ProductSizeCategories { get; set; }

        public List<AdminProductRootCategoryModel> ProductRootCategories { get; set; }
    }
}
