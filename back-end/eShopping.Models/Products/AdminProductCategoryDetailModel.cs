using eShopping.Models.Commons;
using System;
using System.Collections.Generic;

namespace eShopping.Models.Products
{
    public class AdminProductCategoryDetailModel : SEOModel
    {
        public int Priority { get; set; }

        public bool IsShowOnHome { set; get; }

        public List<AdminProductSelectedModel> Products { get; set; }

        public class AdminProductSelectedModel
        {
            public Guid Id { get; set; }

            public string Name { get; set; }

            public int Priority { get; set; }

            public string Thumbnail { get; set; }
        }
    }
}
