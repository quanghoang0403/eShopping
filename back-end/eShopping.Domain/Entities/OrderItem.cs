using eShopping.Domain.Base;
using Microsoft.EntityFrameworkCore;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace eShopping.Domain.Entities
{
    [Table(nameof(OrderItem))]
    public class OrderItem : BaseEntity
    {
        public Guid OrderId { get; set; }

        public Guid ProductId { get; set; }

        public string ProductName { get; set; }

        public string ProductUrl { get; set; }

        public Guid ProductVariantId { get; set; }

        public Guid ProductSizeId { get; set; }

        public string Thumbnail { get; set; }

        public string ProductVariantName { get; set; }

        public string ProductSizeName { get; set; }

        [Precision(18, 2)]
        public decimal PriceOrigin { get; set; }

        [Precision(18, 2)]
        public decimal PriceValue { get; set; }

        [Precision(18, 2)]
        public decimal? PriceDiscount { get; set; }

        public int Quantity { get; set; }

        public float? PercentNumber { get; set; }

        [Precision(18, 2)]
        public decimal TotalPriceOrigin { get { return PriceOrigin * Quantity; } }

        [Precision(18, 2)]
        public decimal TotalPriceValue { get { return PriceValue * Quantity; } }

        [Precision(18, 2)]
        public decimal TotalPriceDiscount { get { return PriceDiscount ?? 0 * Quantity; } }

        /// <summary>
        /// Get price discount if has discount, if not - get normal price
        /// </summary>
        /// [Precision(18, 2)]
        public decimal TotalPrice { get { return TotalPriceDiscount > 0 ? TotalPriceDiscount : TotalPriceValue; } }

        [Precision(18, 2)]
        public decimal Profit { get { return TotalPrice - TotalPriceOrigin; } }

        public string ItemName
        {
            get
            {
                string itemName = ProductName;
                if (!string.IsNullOrWhiteSpace(ProductVariantName))
                {
                    itemName += $" | ({ProductVariantName})";
                }
                if (!string.IsNullOrWhiteSpace(ProductSizeName))
                {
                    itemName += $" | ({ProductSizeName})";
                }
                return itemName;
            }
        }

        public virtual Order Order { get; set; }
    }
}
