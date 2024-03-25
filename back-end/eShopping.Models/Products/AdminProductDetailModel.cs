using eShopping.Domain.Enums;
using eShopping.Models.Commons;
using System;
using System.Collections.Generic;

namespace eShopping.Models.Products
{
    public class AdminProductDetailModel
    {
        public Guid Id { get; set; }

        public int Code { get; set; }

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

        public IEnumerable<AdminProductCategoryModel> ProductCategories { get; set; }

        public IEnumerable<AdminProductPriceModel> ProductPrices { get; set; }

        public IEnumerable<AdminImageModel> Images { get; set; }
    }
}
