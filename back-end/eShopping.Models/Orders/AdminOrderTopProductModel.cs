using Microsoft.EntityFrameworkCore;
using System;

namespace eShopping.Models.Orders
{
    public class AdminOrderTopProductModel
    {
        public int Quantity { get; set; }

        public string ProductName { get; set; }

        public string PriceName { get; set; }

        public int No { get; set; }

        public string Thumbnail { get; set; }

        public string Category { get; set; }

        [Precision(18, 2)]
        public decimal TotalProductCost { get; set; }

        public Guid? ProductId { get; set; }

        public Guid? ProductPriceId { get; set; }

        [Precision(18, 2)]
        public decimal TotalCost { get; set; }
    }
}
