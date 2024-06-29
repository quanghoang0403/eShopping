using eShopping.Domain.Enums;
using eShopping.Models.Commons;
using System;
using System.Collections.Generic;
using System.Linq;

namespace eShopping.Models.ProductCategories
{
    public class AdminProductCategoryDetailModel : SEOModel
    {
        public int Priority { get; set; }

        public bool IsActive { get; set; }
        public EnumGenderProduct GenderProduct { get; set; }

        public Guid ProductRootCategoryId { get; set; }

        public IEnumerable<AdminProductSelectedModel> Products { get; set; }

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
    }
}
