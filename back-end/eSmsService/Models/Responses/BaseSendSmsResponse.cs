using eSmsService.Models.Enums;

using eShopping.Common.Extensions;

using System;

namespace eSmsService.Models.Responses
{
    public class BaseSendSmsResponse
    {
        public string CodeResult { get; set; }

        public string CodeDescription => ((EnumEsmsStatusCode)Enum.Parse(typeof(EnumEsmsStatusCode), CodeResult)).GetDescription();

        
    }
}