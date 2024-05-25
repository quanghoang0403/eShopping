using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace eShopping.Domain.Entities
{
    [Table(nameof(BlogInCategory))]
    public class BlogInCategory
    {
        public Guid BlogId { get; set; }

        public virtual Blog Blog { get; set; }

        public Guid BlogCategoryId { get; set; }

        public virtual BlogCategory BlogCategory { get; set; }
    }
}
