using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace eShopping.Payment.PayPal.Model;
public class PayPalGenerateClientTokenResponse
{
    [JsonProperty("client_token")]
    public string ClientToken { get; set; }

    [JsonProperty("expires_in")]
    public decimal ExpiresIn { get; set; }
}
