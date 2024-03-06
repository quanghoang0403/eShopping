using Microsoft.EntityFrameworkCore;
using System;

namespace eShopping.Models.Products
{
    public class ProductPriceModel
    {
        public Guid? Id { get; set; }

        public string Name { get; set; }

        [Precision(18, 2)]
        public decimal Price { set; get; }

        public int QuantityLeft { get; set; }

        public int QuantitySold { get; set; }

        public int Priority { get; set; }
    }
}
