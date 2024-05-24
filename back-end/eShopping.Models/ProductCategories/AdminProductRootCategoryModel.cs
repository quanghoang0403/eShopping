using eShopping.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;

namespace eShopping.Models.ProductCategories
{
    public class AdminProductRootCategoryModel
    {
        public Guid Id { get; set; }

        public string Name { get; set; }

        public EnumGenderProduct GenderProduct { get; set; }

        public int No { get; set; }

        public int Priority { get; set; }

        public int NumberOfProduct
        {
            get
            {
                if (Products == null)
                {
                    return 0;
                }

                return Products.Count();
            }
        }

        public int NumberOfProductCategory
        {
            get
            {
                if (Products == null)
                {
                    return 0;
                }

                return ProductCategories.Count();
            }
        }

        public IEnumerable<AdminProductSelectedModel> Products { get; set; }

        public IEnumerable<AdminProductCategorySelectedModel> ProductCategories { get; set; }

    }
}
