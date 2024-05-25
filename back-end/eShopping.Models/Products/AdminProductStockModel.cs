using System;

namespace eShopping.Models.Products
{
    public class AdminProductStockModel
    {
        public Guid? Id { get; set; }

        public Guid ProductVariantId { get; set; }

        public Guid ProductSizeId { get; set; }

        public int QuantityLeft { get; set; }

    }
}
