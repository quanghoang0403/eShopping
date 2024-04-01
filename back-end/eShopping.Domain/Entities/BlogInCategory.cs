using eShopping.Domain.Base;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace eShopping.Domain.Entities
{
    [Table(nameof(BlogInCategory))]
    public class BlogInCategory : BaseEntity
    {
        public Guid blogId { get; set; }
        public virtual Blog blog { get; set; }
        public Guid categoryId { get; set; }
        public virtual BlogCategory category { get; set; }
    }
}
