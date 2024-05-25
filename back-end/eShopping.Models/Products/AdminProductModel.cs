using System;
using System.Collections.Generic;

namespace eShopping.Models.Products
{
    public class AdminProductModel
    {
        public Guid Id { get; set; }

        public int Code { get; set; }

        public Guid ProductCategoryId { get; set; }

        public string Name { get; set; }

        public string Description { get; set; }

        public string Thumbnail { get; set; }

        public IEnumerable<AdminProductVariantModel> ProductVariantModels { get; set; }
    }
}
