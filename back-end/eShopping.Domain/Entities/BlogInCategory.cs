using eShopping.Domain.Base;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace eShopping.Domain.Entities
{
    [Table(nameof(BlogInCategory))]
    public class BlogInCategory : BaseEntity
    {
        public Guid BlogId { get; set; }
        public virtual Blog Blog { get; set; }
        public Guid CategoryId { get; set; }
        public virtual BlogCategory Category { get; set; }
    }
}
