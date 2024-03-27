using System;

namespace eShopping.Models.Products
{
    public class AdminProductPriceGroupModel
    {
        public Guid? ProductPriceId { get; set; }

        public int Quantity { get; set; }

        public Guid? ProductId { get; set; }
    }
}
