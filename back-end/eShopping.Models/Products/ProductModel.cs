using System;
using System.Collections.Generic;

namespace eShopping.Models.Products
{
    public class ProductModel
    {
        public Guid Id { get; set; }

        public Guid CategoryId { get; set; }

        public string Name { get; set; }

        public string Description { get; set; }

        public string Thumbnail { get; set; }

        public IEnumerable<ProductOptionModel> ProductOptionModels { get; set; }
    }
}
