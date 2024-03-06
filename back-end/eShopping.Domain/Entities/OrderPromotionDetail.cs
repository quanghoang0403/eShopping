using eShopping.Domain.Base;
using eShopping.Domain.Enums;
using Microsoft.EntityFrameworkCore;
using System;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations.Schema;

namespace eShopping.Domain.Entities
{
    [Table(nameof(OrderPromotionDetail))]
    public class OrderPromotionDetail : BaseEntity
    {

        public Guid OrderId { get; set; }

        public Guid? OrderItemId { get; set; }

        public Guid PromotionId { get; set; }

        public string PromotionName { get; set; }

        [Description("Discount total, discount product, discount product category")]
        public EnumPromotion PromotionType { get; set; }


        [Description("PercentNumber > 0 is promotion by percent")]
        public int PercentNumber { get; set; }

        [Precision(18, 2)]
        public decimal MaximumDiscountAmount { get; set; }

        [Precision(18, 2)]
        public decimal PromotionValue { get; set; }

        public virtual Order Order { get; set; }
    }
}
