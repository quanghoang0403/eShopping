using eShopping.Domain.Base;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace eShopping.Domain.Entities
{
    [Table(nameof(ProductInCategory))]
    public class ProductInCategory : BaseEntity
    {
        public Guid ProductId { get; set; }

        public virtual Product Product { get; set; }

        public Guid ProductCategoryId { get; set; }

        public virtual ProductCategory ProductCategory { get; set; }
    }
}
