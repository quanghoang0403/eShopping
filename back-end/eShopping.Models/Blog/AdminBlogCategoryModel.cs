using eShopping.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;

namespace eShopping.Models.Blog
{
    public class AdminBlogCategoryModel
    {
        public Guid Id { get; set; }

        public int No { get; set; }

        public string Name { get; set; }

        public int Priority { get; set; }
        public bool isActive { get; set; }
        public int NumberOfBlogs
        {
            get
            {
                if (Blogs == null)
                {
                    return 0;
                }

                return Blogs.Count();
            }
        }
        public IEnumerable<AdminBlogModel> Blogs { get; set; }
        public EnumColorCategory Color { get; set; }
    }
}
