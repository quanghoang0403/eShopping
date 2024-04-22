using Net.payOS.Types;
using System;
using System.Collections.Generic;

namespace eShopping.Payment.PayOS.Model
{
    public class CreatePaymentRequest
    {
        public Guid OrderId { get; set; }
        public int OrderCode { get; set; }
        public int Amount { get; set; }
        public string Description { get; set; }
        public List<ItemData> Items { get; set; }
        public string CancelUrl { get; set; }
        public string ReturnUrl { get; set; }
    }
}
