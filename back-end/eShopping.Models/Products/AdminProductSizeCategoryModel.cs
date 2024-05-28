﻿using System;
using System.Collections.Generic;

namespace eShopping.Models.Products
{
    public class AdminProductSizeCategoryModel
    {
        public Guid Id { get; set; }

        public string Name { get; set; }

        public IEnumerable<AdminProductSizeModel> ProductSizes { get; set; }
    }
}
