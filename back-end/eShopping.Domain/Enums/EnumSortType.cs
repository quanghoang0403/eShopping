using System.ComponentModel;

namespace eShopping.Domain.Enums
{
    public enum EnumSortType
    {
        [Description("Default")]
        Default = 0,

        [Description("Giá tăng dần")]
        PriceAsc = 1,

        [Description("Giá giảm dần")]
        PriceDesc = 2,
    }
}
