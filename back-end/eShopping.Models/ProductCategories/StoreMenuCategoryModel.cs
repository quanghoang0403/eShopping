using eShopping.Domain.Enums;
using System;
using System.Collections.Generic;

namespace eShopping.Models.ProductCategories
{
    public class StoreMenuCategoryModel
    {
        public EnumGenderProduct GenderProduct { get; set; }

        public IEnumerable<StoreNavigationModel> ProductRootCategories { get; set; }
    }

    public class StoreNavigationModel
    {
        public Guid Id { get; set; }

        public string Name { get; set; }

        public string UrlSEO { get; set; }

        public string Type { get; set; }

        public IEnumerable<StoreNavigationModel> Children { get; set; }
    }
}
