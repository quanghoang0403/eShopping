namespace eShopping.Domain.Enums
{
    public enum EnumPaymentMethod
    {
        COD = 0,
        MoMo = 1,
        ZaloPay = 2,
        ShopeePay = 3,
        BankTransferVietQR = 4,
        VNPayQR = 5,
        PayOS = 6,
        ATM = 7,
        CreditDebitCard = 8,
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
            EnumPaymentMethod.COD => "b26d46a4-c3ab-4182-be94-81bf5c7554e5",
            EnumPaymentMethod.MoMo => "695f4545-5079-439a-8886-7aa12e53229d",
            EnumPaymentMethod.ZaloPay => "86a24ed2-fa7d-49c8-ae36-7b57e6f44260",
            EnumPaymentMethod.ShopeePay => "37ea8d80-d9b2-4208-85bb-8473cf771422",
            EnumPaymentMethod.BankTransferVietQR => "bc3ec865-05a4-4e62-9b03-884a1360d5ca",
            EnumPaymentMethod.VNPayQR => "ab3dbddc-9a37-49e3-9240-04df2f0df0a7",
            EnumPaymentMethod.PayOS => "18c34a7e-1a07-4f8a-83c1-9752bcf67a88",
            EnumPaymentMethod.ATM => "1f4531a5-80b3-ee11-9081-e4aaea620f34",
            EnumPaymentMethod.CreditDebitCard => "ebc2e437-7fb3-ee11-9081-e4aaea620f34",
            _ => string.Empty
        };

        public static EnumPaymentMethod GetEnum(string id) => id switch
        {
            "b26d46a4-c3ab-4182-be94-81bf5c7554e5" => EnumPaymentMethod.COD,
            "695f4545-5079-439a-8886-7aa12e53229d" => EnumPaymentMethod.MoMo,
            "86a24ed2-fa7d-49c8-ae36-7b57e6f44260" => EnumPaymentMethod.ZaloPay,
            "37ea8d80-d9b2-4208-85bb-8473cf771422" => EnumPaymentMethod.ShopeePay,
            "bc3ec865-05a4-4e62-9b03-884a1360d5ca" => EnumPaymentMethod.BankTransferVietQR,
            "ab3dbddc-9a37-49e3-9240-04df2f0df0a7" => EnumPaymentMethod.VNPayQR,
            "18c34a7e-1a07-4f8a-83c1-9752bcf67a88" => EnumPaymentMethod.PayOS,
            "1f4531a5-80b3-ee11-9081-e4aaea620f34" => EnumPaymentMethod.ATM,
            "ebc2e437-7fb3-ee11-9081-e4aaea620f34" => EnumPaymentMethod.CreditDebitCard,
            _ => EnumPaymentMethod.COD
        };

        public static string GetName(this EnumPaymentMethod enums, string languageCode = "en")
        {
            if (languageCode == "vi")
            {
                return enums switch
                {
                    EnumPaymentMethod.COD => "Tiền mặt",
                    EnumPaymentMethod.MoMo => "MoMo",
                    EnumPaymentMethod.ZaloPay => "ZaloPay",
                    EnumPaymentMethod.ShopeePay => "ShopeePay",
                    EnumPaymentMethod.BankTransferVietQR => "Chuyển khoản",
                    EnumPaymentMethod.VNPayQR => "VNPay",
                    EnumPaymentMethod.PayOS => "PayOS",
                    EnumPaymentMethod.ATM => "ATM",
                    EnumPaymentMethod.CreditDebitCard => "Thẻ tín dụng/Thẻ ghi nợ",
                    _ => string.Empty
                };
            }

            return enums switch
            {
                EnumPaymentMethod.COD => "COD",
                EnumPaymentMethod.MoMo => "MoMo",
                EnumPaymentMethod.ZaloPay => "ZaloPay",
                EnumPaymentMethod.ShopeePay => "ShopeePay",
                EnumPaymentMethod.BankTransferVietQR => "Bank Transfer",
                EnumPaymentMethod.VNPayQR => "VNPay",
                EnumPaymentMethod.PayOS => "PayOS",
                EnumPaymentMethod.ATM => "pAtm",
                EnumPaymentMethod.CreditDebitCard => "Credit / Debit Card",
                _ => string.Empty
            };
        }

        public static string GetIcon(this EnumPaymentMethod enums) => enums switch
        {
            EnumPaymentMethod.COD => "/svgs/payment/cash.svg",
            EnumPaymentMethod.MoMo => "/svgs/payment/momo.svg",
            EnumPaymentMethod.ZaloPay => "/svgs/payment/zalo_pay.svg",
            EnumPaymentMethod.ShopeePay => "/svgs/payment/airpay.svg",
            EnumPaymentMethod.BankTransferVietQR => "/svgs/payment/transfer_va.svg",
            EnumPaymentMethod.VNPayQR => "/svgs/payment/vn_pay.svg",
            EnumPaymentMethod.PayOS => "/svgs/payment/vn_pay.svg",
            EnumPaymentMethod.ATM => "/svgs/payment/atm.svg",
            EnumPaymentMethod.CreditDebitCard => "/svgs/payment/credit_card.svg",
            _ => string.Empty
        };

        public static string GetNameTranslate(this EnumPaymentMethod enums) => enums switch
        {
            EnumPaymentMethod.COD => "payment.cod",
            EnumPaymentMethod.MoMo => "payment.momo",
            EnumPaymentMethod.ZaloPay => "payment.zaloPay",
            EnumPaymentMethod.ShopeePay => "payment.shopeePay",
            EnumPaymentMethod.BankTransferVietQR => "payment.bankTransfer",
            EnumPaymentMethod.VNPayQR => "payment.vnPay",
            EnumPaymentMethod.PayOS => "payment.payOS",
            EnumPaymentMethod.ATM => "payment.atm",
            EnumPaymentMethod.CreditDebitCard => "payment.creditDebitCard",
            _ => string.Empty
        };
    }
}

