using eShopping.Domain.Base;
using eShopping.Domain.Enums;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;

namespace eShopping.Domain.Entities
{
    [Table(nameof(Order))]
    public class Order : BaseEntity
    {
        public Guid CustomerId { set; get; }

        /// <summary>
        /// The database generates a value when a row is inserted.
        /// </summary>
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Code { get; set; }

        public EnumOrderStatus Status { get; set; }


        [MaxLength(50)]
        public string ShipName { set; get; }

        [MaxLength(500)]
        public string ShipFullAddress { get; set; }

        [MaxLength(50)]
        public string ShipEmail { set; get; }

        [MaxLength(10)]
        public string ShipPhoneNumber { set; get; }

        [MaxLength(255)]
        public string Note { get; set; }

        [Precision(18, 2)]
        public decimal DeliveryFee { get; set; }

        public int TotalQuantity { get { return OrderItems.Sum(x => x.Quantity); } }

        [Precision(18, 2)]
        public decimal TotalPriceOrigin { get { return OrderItems.Sum(x => x.TotalPriceOrigin); } }

        [Precision(18, 2)]
        public decimal TotalPrice { get { return OrderItems.Sum(x => x.TotalPrice); } }

        [Precision(18, 2)]
        public decimal TotalAmount { get { return TotalPrice + DeliveryFee; } }

        public virtual ICollection<OrderItem> OrderItems { get; set; }

        public virtual ICollection<OrderHistory> OrderHistories { get; set; }

        public virtual Customer Customer { get; set; }

    }
}
