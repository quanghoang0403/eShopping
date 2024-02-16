namespace eShopping.Payment.PayPal.Model;
public class CaptureAuthorizedPaymentRequestModel
{
    public decimal Amount { get; set; }

    public string AuthorizationId { get; set; }

    public string InvoiceId { get; set; }

    public string NoteToPayer { get; set; }

    public string SoftDescriptor { get; set; }
}
