﻿using PhoneNumbers;

namespace eShopping.Common.Helpers
{
    /// <summary>
    /// This class contains all methods to handle the phone number.
    /// </summary>
    public class PhoneHelpers
    {
        /// <summary>
        /// This method is used to convert the phone number.
        /// If you are confused when you have a string is containing phone numbers,
        /// then this is a good solution for your case.
        /// </summary>
        /// <param name="phoneNumber">The phone number, for example: +84123456789 or 0909123456</param>
        /// <param name="countryCode">The country code, for example: US or VN or CN, and so on.</param>
        /// <returns></returns>
        public static PhoneNumber GetPhoneNumber(string phoneNumber, string countryCode)
        {
            // https://www.nuget.org/packages/libphonenumber-csharp
            // You will see more information at here: https://github.com/google/libphonenumber
            // Scroll to the 'Third-party Ports' section.
            var phoneNumberUtil = PhoneNumberUtil.GetInstance();
            return phoneNumberUtil.Parse(phoneNumber, countryCode);
        }

        public static bool ComparePhoneNumber(string phoneNumber1, string phoneNumber2)
        {
            if (phoneNumber1.StartsWith("0")) phoneNumber1 = phoneNumber1[1..];
            if (phoneNumber2.StartsWith("0")) phoneNumber2 = phoneNumber2[1..];

            return phoneNumber1 == phoneNumber2;
        }
    }
}
