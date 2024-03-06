using eShopping.Domain.Base;
using Microsoft.EntityFrameworkCore;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace eShopping.Domain.Entities
{
    [Table(nameof(PromotionProduct))]
    public class PromotionProduct : BaseEntity
    {
        public Guid PromotionId { get; set; }

        public Guid? ProductId { get; set; }

        public Guid? ProductPriceId { get; set; }


        [Precision(18, 2)]
        public decimal SellingPrice { get; set; }

        public virtual Promotion Promotion { get; set; }

        public virtual Product Product { get; set; }

        public virtual ProductPrice ProductPrice { get; set; }
    }
}
