using eShopping.Domain.Base;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace eShopping.Domain.Entities
{
    [Table(nameof(ProductSizeCategory))]
    public class ProductSizeCategory : BaseEntity
    {
        public string Name { get; set; }

        public int Priority { get; set; }

        public virtual IEnumerable<ProductSize> ProductSizes { get; set; }
    }
}
