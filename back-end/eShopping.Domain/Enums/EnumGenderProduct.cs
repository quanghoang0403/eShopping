using System.ComponentModel;
using System.Reflection.Metadata.Ecma335;

namespace eShopping.Domain.Enums
{
    public enum EnumGenderProduct
    {
        [Description("All")]
        All = 0,

        [Description("Male")]
        Male = 1,

        [Description("Female")]
        Female = 2,

        [Description("Kid")]
        Kid = 3,
    }

    public static class EnumGenderProductExtension
    {
        public static bool IsMale(this EnumGenderProduct enumGender)
        {
            return enumGender == EnumGenderProduct.All || enumGender == EnumGenderProduct.Male;
        }

        public static bool IsFemale(this EnumGenderProduct enumGender)
        {
            return enumGender == EnumGenderProduct.All || enumGender == EnumGenderProduct.Female;
        }

        public static bool IsKid(this EnumGenderProduct enumGender)
        {
            return enumGender == EnumGenderProduct.All || enumGender == EnumGenderProduct.Kid;
        }

    }
}
