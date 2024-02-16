namespace eShopping.Payment.PayPal.Model;
public class RefundCapturedPaymentRequestModel
{
    public decimal Amount { get; set; }

    public string CaptureId { get; set; }

    public string InvoiceId { get; set; }

    public string NoteToPayer { get; set; }
}
