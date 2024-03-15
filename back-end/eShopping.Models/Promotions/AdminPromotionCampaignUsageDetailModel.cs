using System;

namespace eShopping.Models.Promotions
{
    public class PromotionCampaignUsageDetailModel
    {
        public int No { get; set; }

        public Guid? OrderId { get; set; }

        public int OrderCode { get; set; }

        public decimal? DiscountAmount { get; set; }

        public DateTime? OrderDate { get; set; }
    }
}
