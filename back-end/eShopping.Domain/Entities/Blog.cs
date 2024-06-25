using eShopping.Domain.Base;
using eShopping.Domain.Enums;
using System;
using System.Collections.Generic;

namespace eShopping.Domain.Entities
{
    public class Blog : SEOEntity
    {
        public int ViewCount { set; get; }

        public DateTime? PublishedTime { get; set; }

        public int Priority { set; get; }

        public string Thumbnail { set; get; }

        public string Author { get; set; }

        public virtual IEnumerable<BlogInCategory> BlogInCategories { get; set; }
    }
}
