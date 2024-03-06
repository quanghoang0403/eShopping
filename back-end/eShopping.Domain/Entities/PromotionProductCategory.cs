using eShopping.Domain.Base;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace eShopping.Domain.Entities
{
    [Table(nameof(PromotionProductCategory))]
    public class PromotionProductCategory : BaseEntity
    {
        [Key]
        public Guid PromotionId { get; set; }

        [Key]
        public Guid ProductCategoryId { get; set; }

        public virtual Promotion Promotion { get; set; }

        public virtual ProductCategory ProductCategory { get; set; }
    }
}
