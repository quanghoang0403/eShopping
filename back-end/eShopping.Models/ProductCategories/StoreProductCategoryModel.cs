using eShopping.Domain.Enums;
using System;

namespace eShopping.Models.ProductCategories
{
    public class StoreProductCategoryModel
    {
        public Guid Id { get; set; }

        public Guid ProductRootCategoryId { get; set; }

        public string Name { get; set; }

        public EnumGenderProduct GenderProduct { get; set; }

        public string UrlSEO { get; set; }
    }
}
