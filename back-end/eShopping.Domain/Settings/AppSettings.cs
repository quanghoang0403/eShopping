namespace eShopping.Domain.Settings
{
    public class AppSettings
    {
        public AzureStorageSettings AzureStorageSettings { get; set; }

        public EmailSettings Elastic { get; set; }

        public PaymentSettings PaymentSettings { get; set; }
    }

    public class AzureStorageSettings
    {
        public string DefaultEndpointsProtocol { get; set; }

        public string AccountName { get; set; }

        public string AccountKey { get; set; }

        public string EndpointSuffix { get; set; }

        public string ImageContainer { get; set; }

        public string BlobUri => $"{DefaultEndpointsProtocol}://{AccountName}.blob.{EndpointSuffix}/{ImageContainer}";
    }

    public class EmailSettings
    {
        public string Email { get; set; }

        public string ApiKey { get; set; }
    }

    public class PaymentSettings
    {
        public MoMoSettings MoMoSettings { get; set; }

        public VNPaySettings VNPaySettings { get; set; }
    }

    public class MoMoSettings
    {
        public string DomainProduction { get; set; }

        public string MomoIpn { get; set; }

        public string PartnerCode { get; set; }

        public string SecretKey { get; set; }

        public string PublicKey { get; set; }

        public string AccessKey { get; set; }
    }

    public class VNPaySettings
    {
        /// <summary>
        /// VNPAY payment endpoint
        /// </summary>
        public string VNPayUrl { get; set; }

        /// <summary>
        /// VNPAY query or refund endpoint
        /// </summary>
        public string BaseUrl { get; set; }

        /// <summary>
        /// VNPAY version
        /// </summary>
        public string VNPayVersion { get; set; }
    }
}