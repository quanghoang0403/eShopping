using eShopping.Models.Products;
using System;
using System.Collections.Generic;

namespace eShopping.Models.ProductCategories
{
    public class AdminProductSizeCategoryDetailModel
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public int Priority { get; set; }
        public IEnumerable<AdminProductSizeModel> ProductSizes { get; set; }
    }
}
