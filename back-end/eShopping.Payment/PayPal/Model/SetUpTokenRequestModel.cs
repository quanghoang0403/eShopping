namespace eShopping.Payment.PayPal.Model;
public class SetUpTokenRequestModel
{
    public string CardNumber { get; set; }

    public string Expiry { get; set; }

    public string Name { get; set; }

    public string AddressLine1 { get; set; }

    public string AddressLine2 { get; set; }

    public string AdminArea1 { get; set; }

    public string AdminArea2 { get; set; }

    public string PostalCode { get; set; }

    public string CountryCode { get; set; }
}
