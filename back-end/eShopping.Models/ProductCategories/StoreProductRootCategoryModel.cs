using eShopping.Domain.Enums;
using System;
using System.Collections.Generic;

namespace eShopping.Models.ProductCategories
{
    public class StoreProductRootCategoryModel
    {
        public Guid Id { get; set; }

        public string Name { get; set; }

        public EnumGenderProduct GenderProduct { get; set; }

        public string UrlSEO { get; set; }
    }
}
