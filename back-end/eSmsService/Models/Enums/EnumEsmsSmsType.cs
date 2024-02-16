using System.ComponentModel;

namespace eSmsService.Models.Enums
{
    public enum EnumEsmsSmsType
    {
        [Description("Advertisement SMS")]
        Advertisement = 1,

        [Description("CSKH SMS with brandname")]
        CSKH = 2,

        [Description("Fixed Number SMS")]
        FixedNumber = 8,
    }
}