using DocumentFormat.OpenXml.Office2010.ExcelAc;
using System;
using System.Collections.Generic;

namespace eShopping.Models.ProductCategories
{
    public class StoreProductRootCategoryModel
    {
        public Guid Id { get; set; }

        public string Name { get; set; }

        public string UrlSEO { get; set; }

        public IEnumerable<StoreProductCategoryModel> ProductCategories { get; set; }
    }
}
