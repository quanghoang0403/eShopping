using eShopping.Domain.Enums;
using System;
using System.Collections.Generic;

namespace eShopping.Models.ProductCategories
{
    public class StoreMenuCategoryModel
    {
        public EnumGenderProduct GenderProduct { get; set; }

        public IEnumerable<StoreProductRootCategoryModel> ProductRootCategories { get; set; }
    }
}
