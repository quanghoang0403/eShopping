﻿using eShopping.Domain.Base;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace eShopping.Domain.Entities
{
    [Table(nameof(ProductCategory))]
    public class ProductCategory : SEOEntity
    {
        public int Priority { set; get; }

        public Guid ProductRootCategoryId { get; set; }

        public virtual ICollection<Product> Products { get; set; }

        public virtual ProductRootCategory ProductRootCategory { get; set; }
    }
}
