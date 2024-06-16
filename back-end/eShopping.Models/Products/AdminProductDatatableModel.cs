
using System;
using System.Collections.Generic;

namespace eShopping.Models.Products
{
    public class AdminProductDatatableModel
    {
        public Guid Id { get; set; }

        public int Code { get; set; }

        public int No { get; set; }

        public string Name { get; set; }

        public string Thumbnail { get; set; }

        public string Description { get; set; }

        public bool IsActive { get; set; }

        public IEnumerable<AdminProductVariantModel> ProductVariants { get; set; }

        public bool? IsFeatured { get; set; }

        public bool? IsNewIn { get; set; }

        public bool? IsSoldOut { get; set; }

        public bool? IsDiscounted { get; set; }

    }
}
