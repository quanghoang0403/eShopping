using eShopping.Domain.Base;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace eShopping.Domain.Entities
{
    [Table(nameof(Category))]
    public class Category : SEOEntity
    {
        public int Priority { set; get; }

        public bool IsShowOnHome { set; get; }

        public Guid? ParentId { set; get; }

        public virtual ICollection<ProductInCategory> ProductInCategories { get; set; }
    }
}
