using System;

namespace eShopping.Models.Products
{
    public class AdminProductVariantGroupModel
    {
        public Guid? ProductVariantId { get; set; }

        public int Quantity { get; set; }

        public Guid? ProductId { get; set; }
    }
}
