using System.Text.RegularExpressions;

namespace eShopping.Common.Attributes
{
    public partial class RegexAttribute
    {
        [GeneratedRegex("^\\d+$")]
        public static partial Regex ValidatePhoneNumberRegex();
    }
}
