using System.ComponentModel;

namespace eShopping.Domain.Enums
{
    public enum EnumGenderProduct
    {
        [Description("all")]
        All = 0,

        [Description("nam")]
        Male = 1,

        [Description("nu")]
        Female = 2,

        [Description("tre-em")]
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
