namespace eShopping.Payment.VietQR.Models
{
    // The syntax is regulated by VietQR 
    //img.vietqr.io/image/<BANK_ID>-<ACCOUNT_NO>-<TEMPLATE>.png? amount =< AMOUNT > &addInfo =< DESCRIPTION > &accountName =< ACCOUNT_NAME >
    public class QuickLinkQueryModel
    {
        public string AccountName { get; set; }

        public string AddInfo { get; set; }

        public decimal Amount { get; set; }
    }
}
