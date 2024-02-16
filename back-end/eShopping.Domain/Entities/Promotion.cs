using eShopping.Domain.Base;
using eShopping.Domain.Enums;
using Microsoft.EntityFrameworkCore;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace eShopping.Domain.Entities
{
    [Table(nameof(Promotion))]
    public class Promotion : BaseEntity
    {
        public DateTime FromDate { set; get; }

        public DateTime ToDate { set; get; }

        public bool ApplyForAll { set; get; }

        [Precision(18, 2)]
        public int? DiscountPercent { set; get; }

        [Precision(18, 2)]
        public decimal? DiscountAmount { set; get; }

        public string ProductIds { set; get; }

        public string ProductCategoryIds { set; get; }

        public EnumStatus Status { get; set; }

        public string Name { set; get; }
    }
}
