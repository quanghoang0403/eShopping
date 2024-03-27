using eShopping.Domain.Base;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace eShopping.Domain.Entities
{
    [Table(nameof(ProductPrice))]
    public class ProductPrice : BaseEntity
    {
        public Guid ProductId { get; set; }

        [MaxLength(100)]
        public string PriceName { get; set; }

        [Precision(18, 2)]
        public decimal PriceOriginal { set; get; }

        [Precision(18, 2)]
        public decimal PriceValue { set; get; }

        [Precision(18, 2)]
        public decimal? PriceDiscount { set; get; }

        public float? PercentNumber { get; set; }

        public DateTime StartDate { get; set; }

        public DateTime? EndDate { get; set; }

        public int QuantityLeft { get; set; }

        public int QuantitySold { get; set; }

        public int Priority { get; set; }

        public string Thumbnail { set; get; }

        public virtual Product Product { get; set; }

        public virtual ICollection<OrderItem> OrderItems { get; set; }

        public virtual ICollection<Cart> Carts { get; set; }

    }
}
