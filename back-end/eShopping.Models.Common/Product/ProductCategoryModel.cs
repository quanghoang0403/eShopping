using System;
using System.Collections.Generic;
using System.Linq;

namespace GoFoodBeverage.Models.Product
{
    public class ProductCategoryModel
    {

        public Guid Id { get; set; }

        public string Name { get; set; }

        public int SortOrder { get; set; }

        public int NumberOfProduct
        {
            get
            {
                if (Products == null) return 0;
                return Products.Count();
            }
        }

        public IEnumerable<ProductDatatableModel> Products { get; set; }
    }
}
