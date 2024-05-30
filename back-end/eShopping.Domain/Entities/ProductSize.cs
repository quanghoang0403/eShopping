using eShopping.Domain.Base;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace eShopping.Domain.Entities
{
    [Table(nameof(ProductSize))]
    public class ProductSize : BaseEntity
    {
        public string Name { get; set; }

        public Guid ProductSizeCategoryId { get; set; }

        public int Priority { get; set; }

        public virtual ProductSizeCategory ProductSizeCategory { get; set; }
    }
}
