using System;
using System.Collections.Generic;
using System.Linq;

namespace eShopping.Models.Products
{
    public class ProductCategoryModel
    {

        public Guid Id { get; set; }

        public string Name { get; set; }

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

        public IEnumerable<ProductDatatableModel> Products { get; set; }
    }
}
