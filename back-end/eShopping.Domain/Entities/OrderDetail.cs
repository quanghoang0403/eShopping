using eShopping.Domain.Base;
using Microsoft.EntityFrameworkCore;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace eShopping.Domain.Entities
{
    [Table(nameof(OrderDetail))]
    public class OrderDetail : BaseEntity
    {
        public Guid OrderId { set; get; }
        public Guid ProductOptionId { set; get; }

        [Precision(18, 2)]
        public int Quantity { set; get; }

        [Precision(18, 2)]
        public decimal Price { set; get; }

        [Precision(18, 2)]
        public decimal Total { get; set; }

        public virtual Order Order { get; set; }

        public virtual ProductOption ProductOption { get; set; }

    }
}
