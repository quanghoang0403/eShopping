namespace eShopping.Domain.Settings
{
    public class AppSettings
    {
        public AwsS3Settings AwsS3Settings { get; set; }

        public string UseEmailProvider { get; set; }

        public EmailSettings SendGrid { get; set; }

        public EmailSettings Elastic { get; set; }
    }

    public class AwsS3Settings
    {
        public string Endpoint { get; set; }
        public string AccessKey { get; set; }
        public string SecretKey { get; set; }
        public string BucketName { get; set; }
        public string Folder { get; set; }
    }

    public class EmailSettings
    {
        public string Email { get; set; }

        public string ApiKey { get; set; }
    }

}