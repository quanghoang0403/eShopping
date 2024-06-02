using System;
using System.Collections.Generic;

namespace eShopping.Models.Products
{
    public class AdminProductSizeCategoryModel
    {
        public Guid Id { get; set; }

        public int No { get; set; }

        public int NumberOfProductSize { get; set; }

        public string Name { get; set; }

        public List<AdminProductSizeModel> ProductSizes { get; set; }
    }
}
