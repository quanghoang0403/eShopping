using System;

namespace eShopping.Payment.VNPay.Model
{
    public class VNPayOrderInfoModel
    {
        public long PaymentTranId { get; set; }

        public string Title { get; set; }

        public decimal Amount { get; set; }

        public DateTime CreatedDate { get; set; }

        public string BankCode { get; set; }

        public string CurrencyCode { get; set; }

        public string Locale { get; set; }

        public string ReturnUrl { get; set; }
    }
}
