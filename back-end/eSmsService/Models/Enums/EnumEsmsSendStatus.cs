using System.ComponentModel;

namespace eSmsService.Models.Enums
{
    public enum EnumEsmsSendStatus
    {
        [Description("Waiting to approved")]
        Pending = 1,

        [Description("Waiting to send")]
        WaitingToSend = 2,

        [Description("Sent")]
        Sent = 5
    }
}