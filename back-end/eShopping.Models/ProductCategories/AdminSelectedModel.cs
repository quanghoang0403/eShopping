using System;
using System.Collections.Generic;
using System.Linq;
using eShopping.Models.Products;

namespace eShopping.Models.ProductCategories
{
    public class AdminProductCategorySelectedModel
    {

        public Guid Id { get; set; }

        public string Name { get; set; }

        public int Priority { get; set; }

    }

    public class AdminProductSelectedModel
    {

        public Guid Id { get; set; }

        public string Name { get; set; }

        public string Thumbnail { get; set; }

        public int Priority { get; set; }

    }
}
