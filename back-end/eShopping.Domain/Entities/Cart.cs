using eShopping.Domain.Base;
using Microsoft.EntityFrameworkCore;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace eShopping.Domain.Entities
{
    [Table(nameof(Cart))]
    public class Cart : BaseEntity
    {
        public Guid ProductOptionId { set; get; }

        [Precision(18, 2)]
        public int Quantity { set; get; }

        [Precision(18, 2)]
        public decimal Price { set; get; }

        [Precision(18, 2)]
        public decimal Total { set; get; }

        public Guid CustomerId { get; set; }

        public virtual ProductOption ProductOption { get; set; }

        public DateTime DateCreated { get; set; }

        public virtual Customer Customer { get; set; }
    }
}
