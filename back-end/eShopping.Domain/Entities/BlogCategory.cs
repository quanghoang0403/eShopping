using eShopping.Domain.Base;
using eShopping.Domain.Enums;
using System.Collections.Generic;

namespace eShopping.Domain.Entities
{
    public class BlogCategory : SEOEntity
    {
        public int Priority { set; get; }

        public EnumColorCategory Color { get; set; }

        public ICollection<BlogInCategory> BlogInCategories { get; set; }
    }
}
