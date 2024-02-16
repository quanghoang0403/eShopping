using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace eShopping.Payment.PayPal.Model;
public class PayPalUserInfoResponse
{
    [JsonProperty("user_id")]
    public string UserId { get; set; }

    [JsonProperty("sub")]
    public string Sub { get; set; }

    [JsonProperty("address")]
    public Address Address { get; set; }
}

public class Address
{
    [JsonProperty("street_address")]
    public string StreetAddress { get; set; }
}
