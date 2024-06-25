using eShopping.Domain.Enums;
using eShopping.Models.Commons;
using System;
using System.Collections.Generic;

namespace eShopping.Models.Blog
{
    public class AdminBlogDetailModel : SEOModel
    {
        public int ViewCount { set; get; }
        public int Priority { set; get; }
        public bool IsActive { get; set; }
        public string Thumbnail { set; get; }
        public string Author { get; set; }
        public DateTime LastSavedTime { get; set; }
        public DateTime CreatedTime { get; set; }
        public IEnumerable<AdminBlogCategoryModel> BlogCategories { get; set; }
    }
}
