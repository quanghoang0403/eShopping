using System;

namespace eShopping.Models.Promotions
{
    public class AdminPromotionModel
    {
        public Guid Id { get; set; }

        public string Name { get; set; }

        public int PromotionTypeId { get; set; }

        public bool IsPercentDiscount { get; set; }

        public float PercentNumber { get; set; }

        public decimal MaximumDiscountAmount { get; set; }

        public DateTime StartDate { get; set; }

        public DateTime? EndDate { get; set; }

        public string TermsAndCondition { get; set; }

        public bool? IsMinimumPurchaseAmount { get; set; }

        public decimal? MinimumPurchaseAmount { get; set; }

        public bool IsStopped { get; set; }

        public int StatusId { get; set; }

        public int No { get; set; }

    }
}
