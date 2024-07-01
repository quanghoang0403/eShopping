﻿using eShopping.Domain.Enums;
using eShopping.Models.Commons;
using System.Collections.Generic;
using System.Linq;

namespace eShopping.Models.ProductCategories
{
    public class AdminProductRootCategoryDetailModel : SEOModel
    {
        public int Priority { get; set; }

        public bool IsActive { get; set; }

        public EnumGenderProduct GenderProduct { get; set; }

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
