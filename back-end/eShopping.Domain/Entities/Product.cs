﻿using eShopping.Domain.Base;
using eShopping.Domain.Enums;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace eShopping.Domain.Entities
{
    [Table(nameof(Product))]
    public class Product : SEOEntity
    {
        public int ViewCount { set; get; }

        public bool? IsFeatured { get; set; }

        public EnumStatus Status { get; set; }

        public int Priority { set; get; }

        public string Thumbnail { set; get; }

        public virtual ICollection<ProductInCategory> ProductInCategories { get; set; }

        public virtual ICollection<ProductPrice> ProductPrices { get; set; }

        public virtual ICollection<PromotionProduct> PromotionProducts { get; set; }

        public virtual ICollection<Image> Images { get; set; }
    }
}