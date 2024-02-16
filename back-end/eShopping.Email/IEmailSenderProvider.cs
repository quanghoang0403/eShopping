using System.Threading.Tasks;
using System.Collections.Generic;
using ElasticEmail.Model;

namespace eShopping.Email
{
    public interface IEmailSenderProvider
    {
        /// <summary>
        /// This method is used to send email to the user.
        /// </summary>
        /// <param name="subject">The subject string.</param>
        /// <param name="htmlContent">The email content.</param>
        /// <param name="receiver">The receiver's email address.</param>
        /// <returns>If the value is true, the email has been sent successfully.</returns>
        Task<EmailSend> SendEmailAsync(
            string subject,
            string htmlContent,
            string receiver
        );

        /// <summary>
        /// This method is used to send emails to the user list.
        /// </summary>
        /// <param name="subject">The subject string.</param>
        /// <param name="htmlContent">The email content.</param>
        /// <param name="receiverList">List of email addresses.</param>
        /// <returns>If the value is true, the emails have been sent successfully.</returns>
        Task<EmailSend> SendEmailAsync(
            string subject,
            string htmlContent,
            IEnumerable<string> receiverList
        );

        Task<ApiTypes.EmailJobStatus> GetStatusAsync(
            string transactionID,
            bool showFailed = false,
            bool showSent = false,
            bool showDelivered = false,
            bool showPending = false, 
            bool showOpened = false,
            bool showClicked = false,
            bool showAbuse = false,
            bool showUnsubscribed = false,
            bool showErrors = false,
            bool showMessageIDs = false);
    }
}
