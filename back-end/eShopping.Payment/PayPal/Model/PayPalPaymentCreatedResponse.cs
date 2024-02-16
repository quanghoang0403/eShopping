using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace eShopping.Payment.PayPal.Model;
public class PayPalPaymentCreatedResponse
{
    [JsonProperty("id")]
    public string Id { get; set; }

    [JsonProperty("intent")]
    public string Intent { get; set; }

    [JsonProperty("state")]
    public string State { get; set; }

    [JsonProperty("payer")]
    public PayerModel Payer { get; set; }

    [JsonProperty("transactions")]
    public Transaction[] Transactions { get; set; }

    [JsonProperty("create_time")]
    public DateTime CreateTime { get; set; }

    [JsonProperty("links")]
    public Link[] Links { get; set; }

    public class PayerModel
    {

        [JsonProperty("payment_method")]
        public string PaymentMethod { get; set; }
    }

    public class Transaction
    {

        [JsonProperty("amount")]
        public Amount Amount { get; set; }

        [JsonProperty("related_resources")]
        public object[] RelatedResources { get; set; }
    }

    public class Amount
    {

        [JsonProperty("total")]
        public string Total { get; set; }

        [JsonProperty("currency")]
        public string Currency { get; set; }
    }

    public class Link
    {

        [JsonProperty("href")]
        public string Href { get; set; }

        [JsonProperty("rel")]
        public string Rel { get; set; }

        [JsonProperty("method")]
        public string Method { get; set; }
    }
}
