using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace eShopping.Payment.PayPal.Model;

public class PayPalAuthorizeOrderResponse
{
    [JsonProperty("id")]
    public string Id { get; set; }

    [JsonProperty("intent")]
    public string Intent { get; set; }

    [JsonProperty("status")]
    public string Status { get; set; }

    [JsonProperty("payment_source")]
    public PaymentSource PaymentSource { get; set; }

    [JsonProperty("purchase_units")]
    public List<AuthorizePurchaseUnit> PurchaseUnits { get; set; }

    [JsonProperty("payer")]
    public Payer Payer { get; set; }

    [JsonProperty("create_time")]
    public DateTime CreateTime { get; set; }

    [JsonProperty("update_time")]
    public DateTime UpdateTime { get; set; }

    [JsonProperty("links")]
    public List<AuthorizeLink> Links { get; set; }
}

public class AuthorizeAddress
{
    [JsonProperty("country_code")]
    public string CountryCode { get; set; }

    [JsonProperty("address_line_1")]
    public string AddressLine1 { get; set; }

    [JsonProperty("admin_area_2")]
    public string AdminArea2 { get; set; }

    [JsonProperty("admin_area_1")]
    public string AdminArea1 { get; set; }

    [JsonProperty("postal_code")]
    public string PostalCode { get; set; }
}

public class AuthorizeAmount
{
    [JsonProperty("currency_code")]
    public string CurrencyCode { get; set; }

    [JsonProperty("value")]
    public string Value { get; set; }
}

public class Authorization
{
    [JsonProperty("status")]
    public string Status { get; set; }

    [JsonProperty("id")]
    public string Id { get; set; }

    [JsonProperty("amount")]
    public AuthorizeAmount Amount { get; set; }

    [JsonProperty("seller_protection")]
    public SellerProtection SellerProtection { get; set; }

    [JsonProperty("expiration_time")]
    public DateTime ExpirationTime { get; set; }

    [JsonProperty("links")]
    public List<AuthorizeLink> Links { get; set; }

    [JsonProperty("create_time")]
    public DateTime CreateTime { get; set; }

    [JsonProperty("update_time")]
    public DateTime UpdateTime { get; set; }
}

public class AuthorizeLink
{
    [JsonProperty("href")]
    public string Href { get; set; }

    [JsonProperty("rel")]
    public string Rel { get; set; }

    [JsonProperty("method")]
    public string Method { get; set; }
}

public class Name
{
    [JsonProperty("given_name")]
    public string GivenName { get; set; }

    [JsonProperty("surname")]
    public string Surname { get; set; }

    [JsonProperty("full_name")]
    public string FullName { get; set; }
}

public class AuthorizePayee
{
    [JsonProperty("email_address")]
    public string EmailAddress { get; set; }

    [JsonProperty("merchant_id")]
    public string MerchantId { get; set; }
}

public class Payer
{
    [JsonProperty("name")]
    public Name Name { get; set; }

    [JsonProperty("email_address")]
    public string EmailAddress { get; set; }

    [JsonProperty("payer_id")]
    public string PayerId { get; set; }

    [JsonProperty("phone")]
    public Phone Phone { get; set; }

    [JsonProperty("address")]
    public AuthorizeAddress Address { get; set; }
}

public class Payments
{
    [JsonProperty("authorizations")]
    public List<Authorization> Authorizations { get; set; }
}

public class PaymentSource
{
    [JsonProperty("paypal")]
    public Paypal Paypal { get; set; }
}

public class Paypal
{
    [JsonProperty("email_address")]
    public string EmailAddress { get; set; }

    [JsonProperty("account_id")]
    public string AccountId { get; set; }

    [JsonProperty("account_status")]
    public string AccountStatus { get; set; }

    [JsonProperty("name")]
    public Name Name { get; set; }

    [JsonProperty("phone_number")]
    public PhoneNumber PhoneNumber { get; set; }

    [JsonProperty("address")]
    public AuthorizeAddress Address { get; set; }
}

public class Phone
{
    [JsonProperty("phone_number")]
    public PhoneNumber PhoneNumber { get; set; }
}

public class PhoneNumber
{
    [JsonProperty("national_number")]
    public string NationalNumber { get; set; }
}

public class AuthorizePurchaseUnit
{
    [JsonProperty("reference_id")]
    public string ReferenceId { get; set; }

    [JsonProperty("amount")]
    public Amount Amount { get; set; }

    [JsonProperty("payee")]
    public Payee Payee { get; set; }

    [JsonProperty("shipping")]
    public Shipping Shipping { get; set; }

    [JsonProperty("payments")]
    public Payments Payments { get; set; }
}


public class SellerProtection
{
    [JsonProperty("status")]
    public string Status { get; set; }

    [JsonProperty("dispute_categories")]
    public List<string> DisputeCategories { get; set; }
}

public class Shipping
{
    [JsonProperty("name")]
    public Name Name { get; set; }

    [JsonProperty("address")]
    public AuthorizeAddress Address { get; set; }
}

