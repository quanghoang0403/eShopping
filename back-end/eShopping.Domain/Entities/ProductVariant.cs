using eShopping.Domain.Base;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace eShopping.Domain.Entities
{
    [Table(nameof(ProductVariant))]
    public class ProductVariant : BaseEntity
    {
        public Guid ProductId { get; set; }

        [MaxLength(100)]
        public string Name { get; set; }

        public decimal PriceOriginal { set; get; }

        public decimal PriceValue { set; get; }

        public decimal? PriceDiscount { set; get; }

        public float? PercentNumber { get; set; }

        public DateTime StartDate { get; set; }

        public DateTime? EndDate { get; set; }

        public int Priority { get; set; }

        public string Thumbnail { set; get; }

        public virtual Product Product { get; set; }
    }
}
