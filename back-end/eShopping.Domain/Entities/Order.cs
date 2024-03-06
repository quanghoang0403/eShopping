using eShopping.Domain.Base;
using eShopping.Domain.Enums;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace eShopping.Domain.Entities
{
    [Table(nameof(Order))]
    public class Order : BaseEntity
    {

        public DateTime OrderDate { set; get; }

        public EnumOrderStatus Status { get; set; }

        public Guid UserId { set; get; }

        [MaxLength(50)]
        public string ShipName { set; get; }

        [MaxLength(500)]
        public string ShipAddress { set; get; }

        [MaxLength(50)]
        public string ShipEmail { set; get; }

        [MaxLength(10)]
        public string ShipPhoneNumber { set; get; }

        public virtual ICollection<OrderItem> OrderItems { get; set; }

        public virtual ICollection<OrderHistory> OrderHistories { get; set; }

        public virtual Customer Customer { get; set; }

    }
}
