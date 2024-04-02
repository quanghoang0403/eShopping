namespace eShopping.Domain.Settings
{
    public class AppSettings
    {
        public AzureStorageSettings AzureStorageSettings { get; set; }

        public EmailSettings Elastic { get; set; }
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

}