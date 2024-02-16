using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace eShopping.Payment.PayPal.Model;
public class PayPalCreateOrderResponse
{
    [JsonProperty("id")]
    public string Id { get; set; }

    [JsonProperty("intent")]
    public string Intent { get; set; }

    [JsonProperty("status")]
    public string Status { get; set; }

    [JsonProperty("state")]
    public string State { get; set; }

    [JsonProperty("purchase_units")]
    public List<PurchaseUnit> PurchaseUnits { get; set; }

    [JsonProperty("create_time")]
    public DateTime CreateTime { get; set; }

    [JsonProperty("links")]
    public List<Link> Links { get; set; }

    [JsonProperty("payer")]
    public PayerModel Payer { get; set; }

    [JsonProperty("transactions")]
    public Transaction[] Transactions { get; set; }

    [JsonProperty("cart")]
    public string Cart { get; set; }
}

public class Transaction
{

    [JsonProperty("amount")]
    public Amount Amount { get; set; }

    [JsonProperty("related_resources")]
    public object[] RelatedResources { get; set; }
}
public class PayerModel
{

    [JsonProperty("payment_method")]
    public string PaymentMethod { get; set; }
}

public class Amount
{
    [JsonProperty("currency_code")]
    public string CurrencyCode { get; set; }

    [JsonProperty("value")]
    public string Value { get; set; }

    [JsonProperty("breakdown")]
    public Breakdown Breakdown { get; set; }

    [JsonProperty("total")]
    public string Total { get; set; }

    [JsonProperty("currency")]
    public string Currency { get; set; }
}

public class Breakdown
{
    [JsonProperty("item_total")]
    public ItemTotal ItemTotal { get; set; }
}

public class Item
{
    [JsonProperty("name")]
    public string Name { get; set; }

    [JsonProperty("unit_amount")]
    public UnitAmount UnitAmount { get; set; }

    [JsonProperty("quantity")]
    public string Quantity { get; set; }

    [JsonProperty("description")]
    public string Description { get; set; }
}

public class ItemTotal
{
    [JsonProperty("currency_code")]
    public string CurrencyCode { get; set; }

    [JsonProperty("value")]
    public string Value { get; set; }
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

public class Payee
{
    [JsonProperty("email_address")]
    public string EmailAddress { get; set; }

    [JsonProperty("merchant_id")]
    public string MerchantId { get; set; }
}

public class PurchaseUnit
{
    [JsonProperty("reference_id")]
    public string ReferenceId { get; set; }

    [JsonProperty("amount")]
    public Amount Amount { get; set; }

    [JsonProperty("payee")]
    public Payee Payee { get; set; }

    [JsonProperty("items")]
    public List<Item> Items { get; set; }
}

public class UnitAmount
{
    [JsonProperty("currency_code")]
    public string CurrencyCode { get; set; }

    [JsonProperty("value")]
    public string Value { get; set; }
}