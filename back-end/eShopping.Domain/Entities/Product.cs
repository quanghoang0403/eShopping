﻿using eShopping.Domain.Base;
using eShopping.Domain.Enums;
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

        public bool? IsSoldOut { get { return ProductPrices.All(p => p.QuantityLeft <= 0); } }

        public EnumStatus Status { get; set; }

        public EnumGenderProduct GenderProduct { get; set; }

        // Descending
        public int Priority { set; get; }

        public string Thumbnail { set; get; }

        public Guid ProductCategoryId { get; set; }

        public Guid ProductRootCategoryId { get; set; }

        public virtual ProductRootCategory ProductRootCategory { get; set; }

        public virtual ProductCategory ProductCategory { get; set; }

        public virtual ICollection<ProductPrice> ProductPrices { get; set; }

        public virtual ICollection<Image> Images { get; set; }
    }
}