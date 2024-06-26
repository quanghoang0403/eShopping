using eShopping.Domain.Enums;
using eShopping.Models.Commons;
using System;
using System.Collections.Generic;

namespace eShopping.Models.Blog
{
    public class AdminBlogCategoryDetailModel : SEOModel
    {
        public int Priority { get; set; }
        public EnumColorCategory Color { get; set; }
        public List<AdminBlogSelectedModel> Blogs { get; set; }
        public bool isActive { get; set; }

        public class AdminBlogSelectedModel
        {
            public Guid Id { get; set; }
            public string Name { get; set; }
            public int Priority { get; set; }
        }
    }
}


