using System.ComponentModel;

namespace eShopping.Domain.Enums
{
    public enum EnumStatus
    {
        [Description("InActive")]
        InActive = 0,

        [Description("Active")]
        Active = 1,
    }
    public static class EnumStatusExtensions
    {
        public static int ToInt(this EnumStatus enums) => enums switch
        {
            EnumStatus.InActive => 0,
            EnumStatus.Active => 1,
            _ => 1
        };
    }
}
