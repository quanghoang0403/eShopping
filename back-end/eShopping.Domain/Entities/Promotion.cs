using eShopping.Domain.Base;
using eShopping.Domain.Enums;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace eShopping.Domain.Entities
{
    [Table(nameof(Promotion))]
    public class Promotion : BaseEntity
    {
        public Guid StoreId { get; set; }

        public string Name { get; set; }

        public EnumPromotion PromotionTypeId { get; set; }

        public bool IsPercentDiscount { get; set; }

        [Precision(18, 2)]
        public decimal PercentNumber { get; set; }

        [Precision(18, 2)]
        public decimal MaximumDiscountAmount { get; set; }

        public DateTime StartDate { get; set; }

        public DateTime? EndDate { get; set; }

        public string TermsAndCondition { get; set; }

        public bool? IsMinimumPurchaseAmount { get; set; }

        [Precision(18, 2)]
        public decimal? MinimumPurchaseAmount { get; set; }

        public bool IsSpecificBranch { get; set; }

        public bool IsIncludedTopping { get; set; }

        public bool? IsStopped { get; set; }

        public bool IsApplyAllProducts { get; set; }

        public bool IsApplyAllCategories { get; set; }

        public virtual ICollection<PromotionProduct> PromotionProducts { get; set; }

        public virtual ICollection<PromotionProductCategory> PromotionProductCategories { get; set; }

    }
}
