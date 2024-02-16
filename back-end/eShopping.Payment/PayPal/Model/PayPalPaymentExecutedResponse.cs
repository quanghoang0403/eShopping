using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace eShopping.Payment.PayPal.Model;

public class PayPalPaymentExecutedResponse
{

    [JsonProperty("id")]
    public string Id { get; set; }

    [JsonProperty("intent")]
    public string Intent { get; set; }

    [JsonProperty("state")]
    public string State { get; set; }

    [JsonProperty("cart")]
    public string Cart { get; set; }

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

        [JsonProperty("status")]
        public string Status { get; set; }

        [JsonProperty("payer_info")]
        public PayerInfo PayerInfo { get; set; }
    }

    public class PayerInfo
    {

        [JsonProperty("email")]
        public string Email { get; set; }

        [JsonProperty("first_name")]
        public string FirstName { get; set; }

        [JsonProperty("last_name")]
        public string LastName { get; set; }

        [JsonProperty("payer_id")]
        public string PayerId { get; set; }

        [JsonProperty("shipping_address")]
        public ShippingAddress ShippingAddress { get; set; }

        [JsonProperty("country_code")]
        public string CountryCode { get; set; }

        [JsonProperty("billing_address")]
        public BillingAddress BillingAddress { get; set; }
    }

    public class ShippingAddress
    {
        [JsonProperty("recipient_name")]
        public string RecipientName { get; set; }

        [JsonProperty("line1")]
        public string Line1 { get; set; }

        [JsonProperty("city")]
        public string City { get; set; }

        [JsonProperty("state")]
        public string State { get; set; }

        [JsonProperty("postal_code")]
        public string PostalCode { get; set; }

        [JsonProperty("country_code")]
        public string CountryCode { get; set; }
    }

    public class BillingAddress
    {

        [JsonProperty("line1")]
        public string Line1 { get; set; }

        [JsonProperty("line2")]
        public string Line2 { get; set; }

        [JsonProperty("city")]
        public string City { get; set; }

        [JsonProperty("state")]
        public string State { get; set; }

        [JsonProperty("postal_code")]
        public string PostalCode { get; set; }

        [JsonProperty("country_code")]
        public string CountryCode { get; set; }
    }

    public class Transaction
    {

        [JsonProperty("amount")]
        public Amount Amount { get; set; }

        [JsonProperty("payee")]
        public PayeeModel Payee { get; set; }

        [JsonProperty("item_list")]
        public ItemList ItemList { get; set; }

        [JsonProperty("related_resources")]
        public RelatedResources[] RelatedResources { get; set; }
    }

    public class Amount
    {
        [JsonProperty("total")]
        public string Total { get; set; }

        [JsonProperty("currency")]
        public string Currency { get; set; }

        [JsonProperty("details")]
        public DetailsModel Details { get; set; }
    }

    public class DetailsModel
    {
        [JsonProperty("subtotal")]
        public string Subtotal { get; set; }
    }

    public class PayeeModel
    {
        [JsonProperty("merchant_id")]
        public string MerchantId { get; set; }

        [JsonProperty("email")]
        public string Email { get; set; }
    }

    public class ItemList
    {
        [JsonProperty("shipping_address")]
        public ShippingAddress1 ShippingAddress { get; set; }
    }

    public class ShippingAddress1
    {
        [JsonProperty("recipient_name")]
        public string RecipientName { get; set; }

        [JsonProperty("line1")]
        public string Line1 { get; set; }

        [JsonProperty("city")]
        public string City { get; set; }

        [JsonProperty("state")]
        public string State { get; set; }

        [JsonProperty("postal_code")]
        public string PostalCode { get; set; }

        [JsonProperty("country_code")]
        public string CountryCode { get; set; }
    }

    public class RelatedResources
    {
        [JsonProperty("sale")]
        public SaleModel Sale { get; set; }
    }

    public class SaleModel
    {
        [JsonProperty("id")]
        public string Id { get; set; }

        [JsonProperty("state")]
        public string State { get; set; }

        [JsonProperty("amount")]
        public Amount Amount { get; set; }

        [JsonProperty("payment_mode")]
        public string PaymentMode { get; set; }

        [JsonProperty("protection_eligibility")]
        public string ProtectionEligibility { get; set; }

        [JsonProperty("protection_eligibility_type")]
        public string ProtectionEligibilityType { get; set; }

        [JsonProperty("transaction_fee")]
        public TransactionFee TransactionFee { get; set; }

        [JsonProperty("parent_payment")]
        public string ParentPayment { get; set; }

        [JsonProperty("create_time")]
        public DateTime CreateTime { get; set; }

        [JsonProperty("update_time")]
        public DateTime UpdateTime { get; set; }

        [JsonProperty("links")]
        public Link[] Links { get; set; }
    }

    public class TransactionFee
    {
        [JsonProperty("value")]
        public string Value { get; set; }

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
