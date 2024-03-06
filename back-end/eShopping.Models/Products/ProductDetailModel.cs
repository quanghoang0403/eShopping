using eShopping.Domain.Enums;
using eShopping.Models.Commons;
using eShopping.Models.Products;
using System;
using System.Collections.Generic;

namespace eShopping.Models.Product
{
    public class ProductDetailModel
    {
        public Guid Id { get; set; }

        public string Name { get; set; }

        public string Content { get; set; }

        public string KeywordSEO { get; set; }

        public string UrlSEO { get; set; }

        public string TitleSEO { get; set; }

        public string DescriptionSEO { get; set; }

        public string Description { get; set; }

        public int ViewCount { set; get; }

        public bool? IsFeatured { get; set; }

        public EnumStatus Status { get; set; }

        public int Priority { set; get; }

        public string Thumbnail { set; get; }

        public IEnumerable<ProductCategoryModel> ProductCategories { get; set; }

        public IEnumerable<ProductPriceModel> ProductPrices { get; set; }

        public IEnumerable<ImageModel> Images { get; set; }
    }
}
