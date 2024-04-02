using System;

namespace eShopping.Models.Blog
{
    public class AdminBlogModel
    {
        public string Name { get; set; }
        public int No { get; set; }
        public string Content { get; set; }
        public Guid Id { get; set; }
        public Guid BlogCategoryId { get; set; }
        public int Priority { get; set; }
        public string Description { get; set; }
        public string Thumbnail { get; set; }
    }
}
