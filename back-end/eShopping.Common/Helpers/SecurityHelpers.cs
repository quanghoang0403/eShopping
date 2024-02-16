using System;
using System.Security.Cryptography;
using System.Text;

namespace eShopping.Common.Helpers
{
    public static class SecurityHelpers
    {
        /// DONOT CHANGE VALUE
        private const string SECRET_KEY_SHA256 = "85BEA544-BDF2-415A-A7C2-20D068101189";

        public static string HmacSHA256(string inputData)
        {
            var hash = new StringBuilder();
            byte[] keyBytes = Encoding.UTF8.GetBytes(SECRET_KEY_SHA256);
            byte[] inputBytes = Encoding.UTF8.GetBytes(inputData);
            using (var hmac = new HMACSHA256(keyBytes))
            {
                byte[] hashValue = hmac.ComputeHash(inputBytes);
                foreach (var theByte in hashValue)
                {
                    hash.Append(theByte.ToString("x2"));
                }
            }

            return hash.ToString();
        }

        public static bool IsSHA256Verified(string inputRawData, string inputHashData)
        {
            string myChecksum = HmacSHA256(inputRawData);
            return myChecksum.Equals(inputHashData, StringComparison.InvariantCultureIgnoreCase);
        }

        public static bool VerifySHA256(this string inputRawData, string inputHashData)
        {
            string myChecksum = HmacSHA256(inputRawData);
            return myChecksum.Equals(inputHashData, StringComparison.InvariantCultureIgnoreCase);
        }
    }
}
