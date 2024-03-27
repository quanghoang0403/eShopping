using System;

namespace eShopping.Models.Products
{
    public class StoreProductCategoryModel
    {
        public Guid Id { get; set; }

        public string Name { get; set; }

        public string UrlSEO { get; set; }

        public bool IsShowOnHome { set; get; }
    }
}
