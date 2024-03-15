using System;

namespace eShopping.Models.Products
{
    public class AdminProductPriceGroupModel
    {
        public Guid? ProductPriceId { get; set; }

        public int Quantity { get; set; }

        public decimal TotalCost { get; set; }

        public Guid? ProductId { get; set; }

        public decimal CostPerUnit { get; set; }
    }
}
