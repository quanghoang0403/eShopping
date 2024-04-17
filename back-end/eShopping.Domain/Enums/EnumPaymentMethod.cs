namespace eShopping.Domain.Enums
{
    public enum EnumPaymentMethod
    {
        MoMo = 0,

        ZaloPay = 1,

        CreditDebitCard = 2,

        Cash = 3,

        VNPay = 4,

        COD = 5,

        BankTransfer = 6,

    }

    public static class EnumPaymentMethodExtensions
    {
        public static string[] ValidEnumPaymentMethodIds = new string[]
        {
            "b26d46a4-c3ab-4182-be94-81bf5c7554e5",
            "695f4545-5079-439a-8886-7aa12e53229d",
            "86a24ed2-fa7d-49c8-ae36-7b57e6f44260",
            "37ea8d80-d9b2-4208-85bb-8473cf771422",
            "bc3ec865-05a4-4e62-9b03-884a1360d5ca",
            "ab3dbddc-9a37-49e3-9240-04df2f0df0a7",
            "18c34a7e-1a07-4f8a-83c1-9752bcf67a88",
            "1f4531a5-80b3-ee11-9081-e4aaea620f34",
            "ebc2e437-7fb3-ee11-9081-e4aaea620f34",
        };

        public static string GetId(this EnumPaymentMethod enums) => enums switch
        {
            EnumPaymentMethod.MoMo => "b26d46a4-c3ab-4182-be94-81bf5c7554e5",
            EnumPaymentMethod.ZaloPay => "695f4545-5079-439a-8886-7aa12e53229d",
            EnumPaymentMethod.CreditDebitCard => "86a24ed2-fa7d-49c8-ae36-7b57e6f44260",
            EnumPaymentMethod.Cash => "37ea8d80-d9b2-4208-85bb-8473cf771422",
            EnumPaymentMethod.VNPay => "bc3ec865-05a4-4e62-9b03-884a1360d5ca",
            EnumPaymentMethod.COD => "ab3dbddc-9a37-49e3-9240-04df2f0df0a7",
            EnumPaymentMethod.BankTransfer => "18c34a7e-1a07-4f8a-83c1-9752bcf67a88",
            _ => string.Empty
        };

        public static EnumPaymentMethod GetEnum(string id) => id switch
        {
            "b26d46a4-c3ab-4182-be94-81bf5c7554e5" => EnumPaymentMethod.MoMo,
            "695f4545-5079-439a-8886-7aa12e53229d" => EnumPaymentMethod.ZaloPay,
            "86a24ed2-fa7d-49c8-ae36-7b57e6f44260" => EnumPaymentMethod.CreditDebitCard,
            "37ea8d80-d9b2-4208-85bb-8473cf771422" => EnumPaymentMethod.Cash,
            "bc3ec865-05a4-4e62-9b03-884a1360d5ca" => EnumPaymentMethod.VNPay,
            "ab3dbddc-9a37-49e3-9240-04df2f0df0a7" => EnumPaymentMethod.COD,
            "18c34a7e-1a07-4f8a-83c1-9752bcf67a88" => EnumPaymentMethod.BankTransfer,
            _ => EnumPaymentMethod.Cash
        };

        public static string GetName(this EnumPaymentMethod enums, string languageCode = "en")
        {
            if (languageCode == "vi")
            {
                return enums switch
                {
                    EnumPaymentMethod.MoMo => "MoMo",
                    EnumPaymentMethod.ZaloPay => "Zalo Pay",
                    EnumPaymentMethod.CreditDebitCard => "Thẻ tín dụng/Thẻ ghi nợ",
                    EnumPaymentMethod.Cash => "Tiền mặt",
                    EnumPaymentMethod.VNPay => "VNPay",
                    EnumPaymentMethod.COD => "Tiền mặt",
                    EnumPaymentMethod.BankTransfer => "Chuyển khoản",
                    _ => string.Empty
                };
            }

            return enums switch
            {
                EnumPaymentMethod.MoMo => "MoMo",
                EnumPaymentMethod.ZaloPay => "Zalo Pay",
                EnumPaymentMethod.CreditDebitCard => "Credit / Debit Card",
                EnumPaymentMethod.Cash => "Cash",
                EnumPaymentMethod.VNPay => "VNPay",
                EnumPaymentMethod.COD => "COD",
                EnumPaymentMethod.BankTransfer => "Bank Transfer",
                _ => string.Empty
            };
        }

        public static string GetIcon(this EnumPaymentMethod enums) => enums switch
        {
            EnumPaymentMethod.MoMo => "assets/images/logo-momo.png",
            EnumPaymentMethod.ZaloPay => "assets/images/zalo-pay-logo.png",
            EnumPaymentMethod.CreditDebitCard => "assets/images/payment-card-logo.png",
            EnumPaymentMethod.Cash => "assets/images/payment-cash-logo.png",
            EnumPaymentMethod.VNPay => "assets/images/vnpay-logo.png",
            EnumPaymentMethod.COD => "assets/images/payment-default-logo.png",
            EnumPaymentMethod.BankTransfer => "assets/images/bank-transfer-logo.png",
            _ => string.Empty
        };

        public static string GetNameTranslate(this EnumPaymentMethod enums) => enums switch
        {
            EnumPaymentMethod.MoMo => "payment.momo",
            EnumPaymentMethod.ZaloPay => "payment.zaloPay",
            EnumPaymentMethod.CreditDebitCard => "payment.creditDebitCard",
            EnumPaymentMethod.Cash => "payment.cash",
            EnumPaymentMethod.VNPay => "payment.vnPay",
            EnumPaymentMethod.COD => "payment.cod",
            EnumPaymentMethod.BankTransfer => "payment.bankTransfer",
            _ => string.Empty
        };
    }
}

