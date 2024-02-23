
using System;
using System.Collections.Generic;

namespace eShopping.Models.Products
{
    public class ProductDatatableModel
    {
        public Guid Id { get; set; }

        public string Name { get; set; }

        public string Thumbnail { get; set; }

        public string Description { get; set; }

        public bool IsActive { get; set; }

        public IEnumerable<ProductOptionModel> ProductOptions { get; set; }

    }
}
