using eShopping.Common.Extensions;
using eShopping.Payment.VietQR.Constants;
using System;
using System.Linq;
using System.Web;

namespace eShopping.Payment.VietQR.Models
{
    public class QuickLinkModel
    {
        public string BankCode { get; set; }

        public string BankAccountNumber { get; set; }

        public string BankAccountName { get;set; }

        public string Description { get;set; }

        public decimal Amount { get;set; }

        public string QrUrl
        {
            get
            {
                string qrUrl = $"{StringConstants.VIETQR_QUICK_LINK_ENDPOINT}/{BankCode}-{BankAccountNumber}-{QRTemplate.QR_ONLY}{StringConstants.VIETQR_DEFAULT_IMAGE_FORMAT}";
                string queryString = GetQueryString(new QuickLinkQueryModel()
                {
                    AccountName = BankAccountName,
                    AddInfo = Description,
                    Amount = Math.Round(Amount, MidpointRounding.AwayFromZero),
                });

                if (!string.IsNullOrWhiteSpace(queryString))
                {
                    qrUrl += "?" + queryString;
                }

                return qrUrl;
            }
        }

        public QuickLinkModel(string bankCode, string bankAccountNumber)
        {
            BankCode = bankCode;
            BankAccountNumber = bankAccountNumber;
        }

        public QuickLinkModel(string bankCode, string bankAccountNumber, string bankAccountName, string description, decimal amount)
        {
            BankCode = bankCode;
            BankAccountNumber = bankAccountNumber;
            BankAccountName = bankAccountName;
            Description = description;
            Amount = amount;
        }

        public static string GetQueryString(object obj)
        {
            var properties = from p in obj.GetType().GetProperties()
                             where p.GetValue(obj, null) != null
                             select p.Name.ConvertFirstLetterToLower() + "=" + HttpUtility.UrlEncode(p.GetValue(obj, null).ToString());

            return string.Join("&", properties.ToArray());
        }
    }
}
