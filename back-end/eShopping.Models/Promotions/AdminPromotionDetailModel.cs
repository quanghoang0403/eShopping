using System;
using System.Collections.Generic;

namespace eShopping.Models.Promotions
{
    public class PromotionDetailModel
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

        public int StatusId { get; set; }

        public bool IsApplyAllProducts { get; set; }

        public bool IsApplyAllCategories { get; set; }

        public IEnumerable<ProductDto> Products { get; set; }

        public IEnumerable<ProductPriceDto> ProductPrices { get; set; }

        public IEnumerable<ProductCategoryDto> ProductCategories { get; set; }

        public class ProductDto
        {
            public Guid Id { get; set; }

            public string Name { get; set; }

            public string PriceName { get; set; }
        }

        public class ProductPriceDto
        {
            public Guid Id { get; set; }

            public string Name { get; set; }

            public string ProductName { get; set; }
        }

        public class ProductCategoryDto
        {
            public Guid Id { get; set; }

            public string Name { get; set; }
        }
    }
}
