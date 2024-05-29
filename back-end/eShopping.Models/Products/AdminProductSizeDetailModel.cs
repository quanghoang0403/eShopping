using System;

namespace eShopping.Models.Products
{
    public class AdminProductSizeDetailModel
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public AdminProductSizeCategoryModel ProductSizeCategory { get; set; }
    }
}
