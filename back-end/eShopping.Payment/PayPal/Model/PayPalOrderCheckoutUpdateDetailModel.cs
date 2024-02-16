using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace eShopping.Payment.PayPal.Model;
public class PayPalOrderCheckoutUpdateDetailModel
{
    [JsonProperty("op")]
    public string Op { get; set; }

    [JsonProperty("path")]
    public string Path { get; set; }

    [JsonProperty("value")]
    public object Value { get; set; }
}
