using ElasticEmail.Model;
using eShopping.Domain.Settings;
using Microsoft.Extensions.Options;
using SendGrid;
using SendGrid.Helpers.Mail;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace eShopping.Email
{
    /// <summary>
    /// This class contains all methods to help you send emails to the email address list.
    /// </summary>
    public class EmailSenderProvider : IEmailSenderProvider
    {
        private readonly AppSettings _appSettings;

        public EmailSenderProvider(IOptions<AppSettings> appSettings)
        {
            _appSettings = appSettings.Value;
        }

        /// <summary>
        /// This method is used to send email to the user.
        /// </summary>
        /// <param name="subject">The subject string.</param>
        /// <param name="htmlContent">The email content.</param>
        /// <param name="receiver">The receiver's email address.</param>
        /// <returns>If the value is true, the email has been sent successfully.</returns>
        public async Task<EmailSend> SendEmailAsync(
            string subject,
            string htmlContent,
            string receiver
        )
        {
            var result = await SendEmailAsync(subject, htmlContent, new List<string> { receiver });

            return result;
        }

        /// <summary>
        /// This method is used to send emails to the user list.
        /// </summary>
        /// <param name="subject">The subject string.</param>
        /// <param name="htmlContent">The email content.</param>
        /// <param name="receiverList">List of email addresses.</param>
        /// <returns>If the value is true, the emails have been sent successfully.</returns>
        public async Task<EmailSend> SendEmailAsync(
            string subject,
            string htmlContent,
            IEnumerable<string> receiverList
        )
        {
            var result = await UseTheElasticProvider(receiverList, subject, htmlContent);

            return result;
        }

        public async Task<ApiTypes.EmailJobStatus> GetStatusAsync(
            string transactionId,
            bool showFailed = false,
            bool showSent = false,
            bool showDelivered = false,
            bool showPending = false,
            bool showOpened = false,
            bool showClicked = false,
            bool showAbuse = false,
            bool showUnsubscribed = false,
            bool showErrors = false,
            bool showMessageIDs = false)
        {
            string apiKey = _appSettings.Elastic.ApiKey;
            Api.ApiKey = apiKey;

            ApiTypes.EmailJobStatus result = await Api.Email.GetStatusAsync(
                transactionId,
                showFailed,
                showSent,
                showDelivered,
                showPending,
                showOpened,
                showClicked,
                showAbuse,
                showUnsubscribed,
                showErrors,
                showMessageIDs);

            return result;
        }


        /// <summary>
        /// Description: this method is used to send .
        /// </summary>
        /// <summary>
        /// This method is used to send emails using the SendGrid email provider.
        /// </summary>
        /// <param name="receiverList">The receiver, for example: receiver@domain.com</param>
        /// <param name="subject">The email subject</param>
        /// <param name="htmlContent">The HTML body content.</param>
        /// <returns>If the value is true, the email has been sent to the provider.</returns>
        private async Task<bool> UseTheSendGridProvider(
            List<string> receiverList,
            string subject,
            string htmlContent
        )
        {
            var sender = _appSettings.SendGrid.Email;
            var apiKey = _appSettings.SendGrid.ApiKey;
            bool result = false;
            try
            {
                var client = new SendGridClient(apiKey);
                var from = new EmailAddress(sender);
                var receiverEmailAddressList = receiverList
                    .Select(aReceiver => new EmailAddress(aReceiver))
                    .ToList();

                var msg = MailHelper.CreateSingleEmailToMultipleRecipients(from, receiverEmailAddressList, subject, htmlContent, htmlContent);

                // If you want to track email, please uncomment this code.
                // Link to refer: https://sendgrid.com/docs/User_Guide/Settings/tracking.html
                //msg.SetClickTracking(false, false);
                //msg.SetOpenTracking(false);
                //msg.SetGoogleAnalytics(false);
                //msg.SetSubscriptionTracking(false);

                var providerResult = await client.SendEmailAsync(msg);

                result = providerResult.IsSuccessStatusCode;
            }
            catch { }

            return result;
        }

        /// <summary>
        /// This method is used to send emails using the Elastic email provider.
        /// </summary>
        /// <param name="receiver">The receiver, for example: receiver@domain.com</param>
        /// <param name="subject">The email subject</param>
        /// <param name="htmlContent">The HTML body content.</param>
        /// <param name="emailTemplate">Please use the constant class BeecowLogistics.Common.EmailTemplateNameConstants</param>
        /// <returns>If the value is true, the email has been sent to the provider.</returns>
        private async Task<EmailSend> UseTheElasticProvider(
            IEnumerable<string> receiverList,
            string subject,
            string htmlContent
        )
        {
            string sender = _appSettings.Elastic.Email;
            string apiKey = _appSettings.Elastic.ApiKey;

            /*            Api.ApiKey = apiKey;
                        ApiTypes.EmailSend result = await Api.Email.SendAsync(
                                subject: subject,
                                from: sender,
                                to: receiverList,
                                bodyHtml: htmlContent
                            );
            */
            ElasticEmailLibraries.ApiKey = apiKey;
            EmailSend result = await ElasticEmailLibraries.Email.SendBulkEmailsAsync(subject: subject,
                    from: sender,
                    to: receiverList,
                    bodyHtml: htmlContent);

            return result;
        }
    }
}
