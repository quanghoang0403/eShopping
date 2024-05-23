using System;
using System.Collections.Generic;
using System.Linq;

namespace eShopping.Models.ProductCategories
{
    public class AdminProductCategoryModel
    {

        public Guid Id { get; set; }

        public int No { get; set; }

        public string Name { get; set; }

        public string ProductRootCategoryName { get; set; }

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

        public IEnumerable<AdminProductSelectedModel> Products { get; set; }
    }
}
