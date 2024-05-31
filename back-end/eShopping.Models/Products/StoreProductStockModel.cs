using Microsoft.EntityFrameworkCore;
using System;
using System.ComponentModel.DataAnnotations;

namespace eShopping.Models.Products
{
    public class StoreProductStockModel
    {
        public Guid ProductSizeId { get; set; }

        public Guid ProductVariantId { get; set; }

        public Guid ProductId { get; set; }

        public int QuantityLeft { get; set; }
    }
}
