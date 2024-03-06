using eShopping.Domain.Base;
using Microsoft.EntityFrameworkCore;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace eShopping.Domain.Entities
{
    [Table(nameof(OrderItem))]
    public class OrderItem : BaseEntity
    {
        public Guid? OrderId { get; set; }

        public Guid? OrderSessionId { get; set; }

        public Guid? ProductPriceId { get; set; }

        /// <summary>
        /// This name compiled from the product name and price name
        /// </summary>
        public string ProductPriceName { get; set; }

        /// <summary>
        /// Original price of product price
        /// </summary>
        [Precision(18, 2)]
        public decimal OriginalPrice { get; set; }

        /// <summary>
        /// Price of item after discount.
        /// </summary>
        [Precision(18, 2)]
        public decimal? PriceAfterDiscount { get; set; }

        public int Quantity { get; set; }

        /// <summary>
        /// Used for merging cart items
        /// </summary>
        [NotMapped]
        public int QuantityCompleted { get; set; }

        public decimal TotalPriceAfterDiscount
        {
            get
            {
                return (PriceAfterDiscount ?? 0) * Quantity;
            }
        }

        public string ItemName
        {
            get
            {
                string itemName = ProductName;
                if (!string.IsNullOrWhiteSpace(ProductPriceName))
                {
                    itemName += $" ({ProductPriceName})";
                }

                return itemName;
            }
        }

        public string Notes { get; set; }

        public bool IsPromotionDiscountPercentage { get; set; }

        [Precision(18, 2)]
        public decimal PromotionDiscountValue { get; set; }

        public Guid? PromotionId { get; set; }

        public string PromotionName { get; set; }

        public Guid? ProductId { get; set; }

        public string ProductName { get; set; }

        public virtual Order Order { get; set; }

        public virtual ProductPrice ProductPrice { get; set; }

        public virtual Promotion Promotion { get; set; }

        public virtual Product Product { get; set; }

    }
}
