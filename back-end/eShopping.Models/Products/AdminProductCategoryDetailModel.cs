using System;
using System.Collections.Generic;

namespace eShopping.Models.Products
{
    public class AdminProductCategoryDetailModel
    {
        public Guid Id { get; set; }

        public string Name { get; set; }

        public int Priority { get; set; }

        public string Content { get; set; }

        public string KeywordSEO { get; set; }

        public string UrlSEO { get; set; }

        public string TitleSEO { get; set; }

        public string DescriptionSEO { get; set; }

        public string Description { get; set; }

        public bool IsShowOnHome { set; get; }

        public Guid? ParentId { set; get; }

        public List<AdminProductSelectedModel> Products { get; set; }

        public class AdminProductSelectedModel
        {
            public Guid Id { get; set; }

            public string Name { get; set; }

            public int Priority { get; set; }

            public string Thumbnail { get; set; }
        }
    }
}
