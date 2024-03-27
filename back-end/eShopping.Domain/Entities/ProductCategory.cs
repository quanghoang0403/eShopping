using eShopping.Domain.Base;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace eShopping.Domain.Entities
{
    [Table(nameof(ProductCategory))]
    public class ProductCategory : SEOEntity
    {
        public int Priority { set; get; }

        public bool IsShowOnHome { set; get; }

        public virtual ICollection<ProductInCategory> ProductInCategories { get; set; }
    }
}
