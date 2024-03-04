using eShopping.Domain.Base;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace eShopping.Domain.Entities
{
    [Table(nameof(ProductOption))]
    public class ProductOption : BaseEntity
    {
        public Guid ProductId { get; set; }

        [MaxLength(100)]
        public string Name { get; set; }

        [Precision(18, 2)]
        public decimal OriginalPrice { set; get; }

        [Precision(18, 2)]
        public decimal Price { set; get; }

        public int QuantityLeft { get; set; }

        public int QuantitySold { get; set; }

        public int Priority { get; set; }

        public virtual Product Product { get; set; }

        public virtual ICollection<OrderDetail> OrderDetails { get; set; }

        public virtual ICollection<Cart> Carts { get; set; }

    }
}
