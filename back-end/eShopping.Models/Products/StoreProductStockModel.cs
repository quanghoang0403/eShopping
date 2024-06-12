using System;

namespace eShopping.Models.Products
{
    public class StoreProductStockModel
    {
        public Guid ProductSizeId { get; set; }

        public Guid ProductVariantId { get; set; }

        public Guid ProductId { get; set; }

        public string ProductSizeName { get; set; }

        public string ProductVariantName { get; set; }

        public int QuantityLeft { get; set; }
    }
}
