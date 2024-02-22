using Microsoft.EntityFrameworkCore;
using System;

namespace GoFoodBeverage.Models.Product
{
    public class ProductOptionModel
    {
        public Guid Id { get; set; }

        public string Name { get; set; }

        [Precision(18, 2)]
        public decimal Price { set; get; }

        public int QuantityLeft { get; set; }

        public int QuantitySold { get; set; }

        public int SortOrder { get; set; }
    }
}
