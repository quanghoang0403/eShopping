using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace eShopping.Domain.Entities
{
    [Table(nameof(ProductStock))]
    public class ProductStock
    {
        [Key]
        public Guid ProductSizeId { get; set; }

        [Key]
        public Guid ProductVariantId { get; set; }

        [Key]
        public Guid ProductId { get; set; }

        public string ProductVariantName { get; set; }

        public string ProductSizeName { get; set; }

        public int QuantityLeft { get; set; }

        public virtual Product Product { get; set; }

    }
}
