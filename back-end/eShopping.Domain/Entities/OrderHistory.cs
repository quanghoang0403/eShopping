using eShopping.Domain.Base;
using eShopping.Domain.Enums;
using System;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace eShopping.Domain.Entities
{
    [Table(nameof(OrderHistory))]
    public class OrderHistory : BaseEntity
    {
        public Guid OrderId { get; set; }

        public string Note { get; set; }

        [MaxLength(255)]
        public string CancelReason { get; set; }

        public virtual Order Order { get; set; }

        [Description("This column will separate log's action of an order")]
        public EnumOrderActionType ActionType { get; set; }
    }
}
