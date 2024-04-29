using eShopping.Domain.Base;
using eShopping.Domain.Enums;
using System;
using System.Collections.Generic;

namespace eShopping.Domain.Entities
{
    public class Blog : SEOEntity
    {
        public int ViewCount { set; get; }
        public EnumStatus Status { get; set; }
        public DateTime? PublishedTime { get; set; }
        public int Priority { set; get; }
        public string Thumbnail { set; get; }
        public virtual IEnumerable<BlogInCategory> BlogInCategories { get; set; }
        public string Author { get; set; }

    }
}
