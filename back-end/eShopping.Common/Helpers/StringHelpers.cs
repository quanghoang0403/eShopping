using eShopping.Common.Extensions;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Text.RegularExpressions;

namespace eShopping.Common.Helpers
{
    public static class StringHelpers
    {
        public static readonly Regex REGEX_WHITESPACE = new(@"\s+");
        private static readonly string[] VietnameseSigns = new string[]
        {
            "aAeEoOuUiIdDyY",

            "áàạảãâấầậẩẫăắằặẳẵ",

            "ÁÀẠẢÃÂẤẦẬẨẪĂẮẰẶẲẴ",

            "éèẹẻẽêếềệểễ",

            "ÉÈẸẺẼÊẾỀỆỂỄ",

            "óòọỏõôốồộổỗơớờợởỡ",

            "ÓÒỌỎÕÔỐỒỘỔỖƠỚỜỢỞỠ",

            "úùụủũưứừựửữ",

            "ÚÙỤỦŨƯỨỪỰỬỮ",

            "íìịỉĩ",

            "ÍÌỊỈĨ",

            "đ",

            "Đ",

            "ýỳỵỷỹ",

            "ÝỲỴỶỸ"
        };

        public static string RemoveExtensionType(string fileName)
        {
            var idx = DateTime.Now.ToString("hhmmssddMMyyyy");
            var extent = fileName.Substring(fileName.LastIndexOf('.'), fileName.Length - fileName.LastIndexOf('.')).ToLower();
            return fileName.Replace(extent, "") + idx;
        }

        public static string UserCodeGenerator(string type)
        {
            var bytes = new byte[4];
            var rng = RandomNumberGenerator.Create();
            rng.GetBytes(bytes);
            uint random = BitConverter.ToUInt32(bytes, 0) % 100000000;

            return $"{type}{String.Format("{0:D8}", random)}";
        }

        public static string GeneratePassword(int length = 8)
        {
            string validChars = "ABCDEFGHJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            Random random = new();

            char[] chars = new char[length];
            for (int i = 0; i < length; i++)
            {
                chars[i] = validChars[random.Next(0, validChars.Length)];
            }

            return new string(chars);
        }

        public static string GenerateValidateCode(int length = 5)
        {
            string validChars = "ABCDEFGHJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            Random random = new();
            char[] chars = new char[length];
            for (int i = 0; i < length; i++)
            {
                chars[i] = validChars[random.Next(0, validChars.Length)];
            }
            return new string(chars);
        }

        public static TimeSpan? StringToTimeSpan(string input)
        {
            TimeSpan time;
            if (!TimeSpan.TryParse(input, out time))
            {
                return null;
            }

            return time;
        }

        public static string TimeSpanToString(TimeSpan input)
        {
            return input.ToString(@"hh\:mm");
        }

        public static string TimeSpanToHourMinutes(TimeSpan input)
        {
            if (input.Minutes > 30)
            {
                input = input.Add(new TimeSpan(1, 0, 0));
            }

            return String.Format("{0:%h} hours", input);
        }

        public static string FormatPriceVND(decimal? price)
        {
            return $"{string.Format("{0:#,##0}", price ?? 0)} VNĐ";
        }

        public static string FormatPrice(decimal? price)
        {
            return $"{string.Format("{0:#,##0}", price ?? 0)}";
        }

        /// <summary>
        /// Ex: 1000 -> 1K, 1400 -> 1.4K, 1000000000 -> 1B
        /// </summary>
        /// <param name="currency"></param>
        /// <returns></returns>
        public static string FormatNumberWithUnit(decimal currency)
        {
            decimal K = 1_000,
                M = 1_000_000,
                B = 1_000_000_000,
                T = 1_000_000_000_000;
            if (currency >= T)
            {
                return Math.Round(currency / T, 1) + "T";
            }
            if (currency >= B)
            {
                return Math.Round(currency / B, 1) + "B";
            }
            if (currency >= M)
            {
                return Math.Round(currency / M, 1) + "M";
            }
            if (currency >= K)
            {
                return Math.Round(currency / K, 1) + "K";
            }

            return currency.ToString();
        }


        /// <summary>
        /// Created date: 2022-01-10
        /// Description: this method is used to generate the order tracking code.
        /// </summary>
        public static string GenerateOrderTrackingCode()
        {
            const string prefix = "BE";
            const int totalNumberOfCharactersToSplit = 9;
            string randomCode = $"{DateTime.Now.Ticks}";
            // For example: 637773999255854918 there are 18 characters in this string.
            // The value will be 255854918.
            randomCode = $"{prefix}{randomCode.Substring(randomCode.Length - totalNumberOfCharactersToSplit, totalNumberOfCharactersToSplit)}";
            return randomCode;

        }

        /// <summary>
        /// Get Company Id From Request Header
        /// </summary>
        /// <param name="httpContextAccessor"></param>
        /// <returns></returns>
        public static Guid GetCompanyIdFromHeader(IHttpContextAccessor httpContextAccessor)
        {
            return new Guid(httpContextAccessor.HttpContext.Request.Headers["workspace-id"]);
        }

        /// <summary>
        /// IsValidEmail
        /// </summary>
        /// <param name="email"></param>
        /// <returns></returns>
        public static bool IsValidEmail(this string email)
        {
            try
            {
                var addr = new System.Net.Mail.MailAddress(email);
                return true;
            }
            catch
            {
                return false;
            }
        }


        /// <summary>
        /// Remove Vietnamese sign (ex: Trường -> Truong
        /// </summary>
        /// <param name="str">Text input</param>
        /// <returns></returns>
        public static string RemoveSign4VietnameseString(string str)
        {
            //Check null or empty String
            if (String.IsNullOrWhiteSpace(str))
            {
                return String.Empty;
            }

            str = str.Trim();

            for (int i = 1; i < VietnameseSigns.Length; i++)
            {
                for (int j = 0; j < VietnameseSigns[i].Length; j++)
                {
                    str = str.Replace(VietnameseSigns[i][j], VietnameseSigns[0][i - 1]);
                }
            }
            return str;
        }

        /// <summary>
        /// Remove Vietnamese sign for key search
        /// </summary>
        /// <param name="str">Text input</param>
        /// <returns></returns>
        public static string StringSearchFormatted(this string str)
        {
            //Check null or empty String
            if (String.IsNullOrWhiteSpace(str))
            {
                return String.Empty;
            }

            str = str.ToLower().RemoveSign4VietnameseString();

            return str;
        }

        #region Aes operation
        private const string SECRET_KEY = "8185f9336386738d3437f9d3050ed70e";

        public static string EncryptString(string plainText)
        {
            byte[] iv = new byte[16];
            byte[] array;

            using (Aes aes = Aes.Create())
            {
                aes.Key = Encoding.UTF8.GetBytes(SECRET_KEY);
                aes.IV = iv;

                ICryptoTransform encryptor = aes.CreateEncryptor(aes.Key, aes.IV);

                using (MemoryStream memoryStream = new())
                {
                    using (CryptoStream cryptoStream = new(memoryStream, encryptor, CryptoStreamMode.Write))
                    {
                        using (StreamWriter streamWriter = new(cryptoStream))
                        {
                            streamWriter.Write(plainText);
                        }

                        array = memoryStream.ToArray();
                    }
                }
            }

            return Convert.ToBase64String(array);
        }

        public static string DecryptString(string cipherText)
        {
            byte[] iv = new byte[16];
            byte[] buffer = Convert.FromBase64String(cipherText);

            using (Aes aes = Aes.Create())
            {
                aes.Key = Encoding.UTF8.GetBytes(SECRET_KEY);
                aes.IV = iv;
                ICryptoTransform decryptor = aes.CreateDecryptor(aes.Key, aes.IV);

                using (MemoryStream memoryStream = new(buffer))
                {
                    using (CryptoStream cryptoStream = new(memoryStream, decryptor, CryptoStreamMode.Read))
                    {
                        using (StreamReader streamReader = new(cryptoStream))
                        {
                            return streamReader.ReadToEnd();
                        }
                    }
                }
            }
        }

        public static string GenerateKey()
        {
            var key = Guid.NewGuid();
            return key.ToString().ToUpper();
        }
        #endregion

        public static string GenerateDiscountCode()
        {
            string validChars = "ABCDEFGHJKLMNOPQRSTUVWXYZ0123456789";
            Random random = new();
            char[] chars = new char[6];
            for (int i = 0; i < 6; i++)
            {
                chars[i] = validChars[random.Next(0, validChars.Length)];
            }
            return new string(chars);
        }

        public static DateTime DateTimeParser(string input, string format)
        {
            var result = DateTime.ParseExact(input, format, CultureInfo.InvariantCulture);

            return result;
        }

        public static bool IsValid(string input)
        {
            return !string.IsNullOrWhiteSpace(input);
        }

        public static string ReplaceParameter(this string originalString, Dictionary<string, string> parameters)
        {
            if (string.IsNullOrEmpty(originalString) || parameters.Count == 0)
            {
                return originalString;
            }

            string replacedString = Regex.Replace(originalString, "{{(.*?)}}", match =>
            {
                string key = match.Groups[1].Value;
                return parameters.ContainsKey(key) ? parameters[key] : match.Value;
            });

            return replacedString;
        }

        public static string GetFullAddressString(
            string address1,
            string wardName,
            string districtName,
            string cityName,
            string countryName)
        {
            List<string> addresses = new() { address1, wardName, districtName, cityName, countryName };
            string fullAddress = string.Join(", ", addresses.Where(s => !string.IsNullOrWhiteSpace(s)));

            return fullAddress;
        }

        public static string UrlEncode(this string value)
        {
            value = RemoveSign4VietnameseString(value);
            string urlEncode = value.ToSafetyString().ToLower();
            string result = RemoveSpecialCharacters(urlEncode, true);
            result = StripUnicodeCharactersFromString(result);
            string symbols = @"/\?#$& ";
            string[] charsToRemove = new string[] { "[", "]" };
            foreach (var c in charsToRemove)
            {
                result = result.Replace(c, string.Empty);
            }

            foreach (var item in symbols)
            {
                result = result.Replace(item, '-');
            }

            string pattern = "-+";
            Regex regex = new(pattern);
            result = regex.Replace(result, "-");

            return result;
        }

        public static string RemoveSpecialCharacters(string input, bool isReplaceWithSpace = false)
        {
            string pattern = "[^a-zA-Z0-9 ]";
            string result = Regex.Replace(input, pattern, isReplaceWithSpace ? " " : "");
            result = Regex.Replace(result, @"\s+", " ").Trim();
            return result;
        }

        public static string ToSafetyString(this object value)
        {
            if (value == null)
            {
                return string.Empty;
            }

            return value.ToString();

        }

        public static string StripUnicodeCharactersFromString(string inputValue)
        {
            StringBuilder newStringBuilder = new();
            newStringBuilder.Append(inputValue.Normalize(NormalizationForm.FormKD).Where(x => x < 128).ToArray());
            return newStringBuilder.ToString();
        }

        public static string ConvertToAppTranslationFormat(this string inputValue)
        {
            return inputValue.Replace('.', ':');
        }

        public static string FormatTextNumber(decimal number)
        {   // Check if the number has non-zero decimals
            bool hasDecimal = (number % 1) != 0;
            // Use different format strings based on the number of decimal places
            if (hasDecimal)
            {
                int decimalPlaces = BitConverter.GetBytes(decimal.GetBits(number)[3])[2];
                return decimalPlaces == 1 ? number.ToString("N1") : number.ToString("N2");
            }
            else { return number.ToString("N0"); }
        }

        public static string GetFirstLetterOfWords(string input)
        {
            var concatInitialWordsOfName = "";
            var splitWords = input.Split(' ');
            foreach (string word in splitWords)
            {
                if (String.IsNullOrEmpty(word))
                {
                    continue;
                }

                concatInitialWordsOfName += word[0];
            }

            return concatInitialWordsOfName;
        }

        public static string GetShortDataHaveIMG(string shortData, string fullData)
        {
            if (!string.IsNullOrEmpty(shortData) || string.IsNullOrEmpty(fullData))
            {
                return shortData;
            }
            string newShortData = fullData.Contains("<img") ? "-" : null;
            return newShortData;
        }
    }
}
