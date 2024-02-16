using ElasticEmail.Api;
using ElasticEmail.Client;
using ElasticEmail.Model;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace eShopping.Email
{
    /// <summary>
    /// Elastic Email REST API (4.0.0)
    /// Docs: https://elasticemail.com/developers/api-documentation/rest-api
    /// </summary>
    public static class ElasticEmailLibraries
    {
        public static string ApiKey = "00000000-0000-0000-0000-000000000000";

        public static class Email
        {
            public static async Task<EmailSend> SendBulkEmailsAsync(
                string subject,
                string from,
                IEnumerable<string> to,
                string bodyHtml)
            {
                Configuration config = new();
                config.ApiKey.Add("X-ElasticEmail-ApiKey", ApiKey);
                var apiInstance = new EmailsApi(config);
                List<EmailRecipient> emailRecipients = new();
                foreach (var recipientEmail in to)
                {
                    var recipients = new EmailRecipient(email: recipientEmail);
                    emailRecipients.Add(recipients);
                }

                EmailMessageData emailData = new(recipients: emailRecipients)
                {
                    Content = new EmailContent
                    {
                        Body = new List<BodyPart>()
                    }
                };
                BodyPart htmlBodyPart = new()
                {
                    ContentType = BodyContentType.HTML,
                    Charset = "utf-8",
                    Content = bodyHtml
                };
                emailData.Content.Body.Add(htmlBodyPart);
                emailData.Content.From = from;
                emailData.Content.Subject = subject;

                try
                {
                    EmailSend emailSend = await apiInstance.EmailsPostAsync(emailData);
                    return emailSend;
                }
                catch (ElasticEmail.Client.ApiException e)
                {
                    Serilog.Log.Error("Exception when calling EmailsApi.EmailsPost: " + e.Message);
                    Serilog.Log.Error("Status Code: " + e.ErrorCode);
                    Serilog.Log.Error(e.StackTrace);
                    throw;
                }
            }
        }
    }
}
