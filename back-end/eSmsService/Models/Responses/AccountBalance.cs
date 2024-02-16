using eSmsService.Models.Enums;

namespace eSmsService.Models.Responses
{
    public class AccountBalance
    {
        public AccountBalance()
        {
        }

        public AccountBalance(double balance, string codeResponse, long userID)
        {
            Balance = balance;
            CodeResponse = codeResponse;
            UserID = userID;
        }

        public double Balance { get; set; }

        public string CodeResponse { get; set; }

        public long UserID { get; set; }

        public bool IsValidApiSecretKey => int.Parse(CodeResponse) != (int)EnumEsmsStatusCode.LoginFailed;
    }
}