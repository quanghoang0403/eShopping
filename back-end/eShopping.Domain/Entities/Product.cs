using eShopping.Domain.Base;
using eShopping.Domain.Enums;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;

namespace eShopping.Domain.Entities
{
    [Table(nameof(Product))]
    public class Product : SEOEntity
    {
        /// <summary>
        /// The database generates a value when a row is inserted.
        /// </summary>
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Code { get; set; }

        public int ViewCount { set; get; }

        public bool? IsFeatured { get; set; }

        public bool? IsDiscounted { get; set; }

        public bool? IsNewIn { get { return DateTime.Now.AddDays(-14) < CreatedTime; } }

        public bool? IsSoldOut { get { return ProductStocks.All(p => p.QuantityLeft <= 0); } }

        public EnumStatus Status { get; set; }

        public EnumGenderProduct GenderProduct { get; set; }

        // Descending
        public int Priority { set; get; }

        public string Thumbnail { set; get; }

        public Guid ProductCategoryId { get; set; }

        public Guid ProductRootCategoryId { get; set; }

        public Guid ProductSizeCategoryId { get; set; }

        [Precision(18, 2)]
        public decimal PriceOriginal { set; get; }

        [Precision(18, 2)]
        public decimal PriceValue { set; get; }

        [Precision(18, 2)]
        public decimal? PriceDiscount { set; get; }

        public float? PercentNumber { get; set; }

        public DateTime StartDate { get; set; }

        public DateTime? EndDate { get; set; }

        public virtual ProductRootCategory ProductRootCategory { get; set; }

        public virtual ProductCategory ProductCategory { get; set; }

        public virtual ProductSizeCategory ProductSizeCategory { get; set; }

        public virtual ICollection<ProductVariant> ProductVariants { get; set; }

        public virtual ICollection<ProductStock> ProductStocks { get; set; }
    }
}