using System.ComponentModel;

namespace eSmsService.Models.Enums
{
    public enum EnumEsmsStatusCode
    {
        [Description("Unknow error")]
        UnknowError = 99,

        [Description("Request success")]
        RequestSuccess = 100,

        [Description("Login failed (Api/Secret Key incorrect)")]
        LoginFailed = 101,

        [Description("Account was banned")]
        AccountWasBanned = 102,

        [Description("Account balance is not enough to send message")]
        AccountBalanceIsNotEnough = 103,

        [Description("Brandname incorrect")]
        BrandnameIncorrect = 104,

        [Description("Cannot find message id")]
        CannotFindMessageId = 105,

        [Description("Record file not found")]
        RecordFileNotFound = 106,

        [Description("Each request required 30 number phone")]
        EachRequestRequired30NumberPhone = 107,

        [Description("Phone number list exceeds the limit")]
        PhoneNumbersListExceedsTheLimit = 120,

        [Description("Duplicate request")]
        DuplicateRequestId = 124,

        [Description("Wrong CSKH template")]
        WrongCskhTemplate = 146,

        [Description("Code already used")]
        CodeAlreadyUsed = 171,

        [Description("Mobile Network Operator is not registered")]
        MobileNetworkOperatorIsNotRegistered = 177,

        [Description("OAID not exists in system")]
        OAIDNotExistsInSystem = 204,

        [Description("Missing SMS type")]
        MissingSmsType = 300,

        [Description("OAID not active")]
        OAIDNotActive = 788,

        [Description("Missing OAID")]
        MissingOAID = 789,
    }
}