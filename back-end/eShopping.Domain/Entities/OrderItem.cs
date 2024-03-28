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

        public Guid ProductPriceId { get; set; }

        public string PriceName { get; set; }

        [Precision(18, 2)]
        public decimal PriceOrigin { get; set; }

        [Precision(18, 2)]
        public decimal PriceValue { get; set; }

        [Precision(18, 2)]
        public decimal? PriceDiscount { get; set; }

        public int Quantity { get; set; }

        public decimal TotalPriceOrigin { get { return PriceOrigin * Quantity; } }

        public decimal TotalPriceValue { get { return PriceValue * Quantity; } }

        public decimal TotalPriceDiscount { get { return PriceDiscount ?? 0 * Quantity; } }

        /// <summary>
        /// Get price discount if has discount, if not - get normal price
        /// </summary>
        public decimal TotalPrice { get { return TotalPriceDiscount > 0 ? TotalPriceDiscount : TotalPriceValue; } }

        public decimal Profit { get { return TotalPrice - TotalPriceOrigin; } }

        public string ItemName
        {
            get
            {
                string itemName = ProductName;
                if (!string.IsNullOrWhiteSpace(PriceName))
                {
                    itemName += $" ({PriceName})";
                }

                return itemName;
            }
        }

        public virtual Order Order { get; set; }

        public virtual ProductPrice ProductPrice { get; set; }

        public virtual Product Product { get; set; }
    }
}
