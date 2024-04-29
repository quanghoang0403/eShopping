using eShopping.Domain.Enums;
using eShopping.Models.Commons;
using System.Collections.Generic;

namespace eShopping.Models.Blog
{
    public class AdminBlogDetailModel : SEOModel
    {
        public int ViewCount { set; get; }
        public int Priority { set; get; }
        public EnumStatus Status { get; set; }
        public string Thumbnail { set; get; }
        public string Author { get; set; }
        public IEnumerable<AdminBlogCategoryModel> BlogCategories { get; set; }
    }
}
