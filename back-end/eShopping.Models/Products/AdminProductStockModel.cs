﻿using System;

namespace eShopping.Models.Products
{
    public class AdminProductStockModel
    {

        public Guid ProductVariantId { get; set; }

        public Guid ProductSizeId { get; set; }

        public string ProductSizeName { get; set; }

        public string ProductVariantName { get; set; }

        public int QuantityLeft { get; set; }

    }
}
