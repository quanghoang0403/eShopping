using eShopping.Domain.Base;
using eShopping.Domain.Enums;
using Microsoft.EntityFrameworkCore;
using System;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations.Schema;

namespace eShopping.Domain.Entities
{
    [Table(nameof(OrderPaymentTransaction))]
    public class OrderPaymentTransaction : BaseEntity
    {
        public Guid OrderId { get; set; }

        public EnumPaymentMethod PaymentMethodId { get; set; }

        [Description("Return value: PAYMENT or REFUND")]
        public EnumTransactionType? TransactionType { get; set; }

        public long? TransId { get; set; }

        public string OrderInfo { get; set; }

        [Precision(18, 2)]
        public decimal Amount { get; set; }

        public string PaymentUrl { get; set; }

        public string ResponseData { get; set; }

        public bool IsSuccess { get; set; }

        public virtual Order Order { get; set; }
    }
}
