using eShopping.Domain.Base;
using eShopping.Domain.Enums;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace eShopping.Domain.Entities
{
    [Table(nameof(Order))]
    public class Order : BaseEntity
    {
        /// <summary>
        /// The database generates a value when a row is inserted.
        /// </summary>
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Code { get; set; }

        public DateTime OrderDate { set; get; }

        public EnumOrderStatus Status { get; set; }

        public Guid UserId { set; get; }

        [MaxLength(50)]
        public string ShipName { set; get; }

        [MaxLength(500)]
        public string ShipAddress { set; get; }

        [MaxLength(50)]
        public string ShipEmail { set; get; }

        [MaxLength(10)]
        public string ShipPhoneNumber { set; get; }

        public Guid? CustomerId { get; set; }

        public Guid? PromotionId { get; set; }

        [MaxLength(255)]
        public string Note { get; set; }


        [Precision(18, 2)]
        public decimal OriginalPrice { get; set; }

        /// <summary>
        /// Sum total discount of all product items in order, promotion
        /// </summary>
        [Precision(18, 2)]
        public decimal TotalDiscountAmount { get; set; }

        public decimal PriceAfterDiscount
        { get { return OriginalPrice - TotalDiscountAmount; } }

        public bool IsPromotionDiscountPercentage { get; set; }

        /// <summary>
        /// Total discount value of promotion
        /// </summary>
        [Precision(18, 2)]
        public decimal PromotionDiscountValue { get; set; }

        /// <summary>
        /// The promotion name apply for this order
        /// </summary>
        public string PromotionName { get; set; }

        [Precision(18, 2)]
        public decimal DeliveryFee { get; set; }


        [Description("Order revenue: OriginalPrice - TotalDiscountAmount + DeliveryFee")]
        [Precision(18, 2)]
        public decimal TotalAmount { get; set; }

        public virtual ICollection<OrderItem> OrderItems { get; set; }

        public virtual ICollection<OrderHistory> OrderHistories { get; set; }

        public virtual ICollection<OrderPromotionDetail> OrderPromotionDetails { get; set; }

        public virtual Customer Customer { get; set; }

    }
}
