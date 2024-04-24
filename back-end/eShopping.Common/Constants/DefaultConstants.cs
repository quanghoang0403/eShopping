using eShopping.Domain.Enums;
using System.Collections.Generic;

namespace eShopping.Common.Constants
{
    public class DefaultConstants
    {
        public const int IMAGE_THUMBNAIL_QUALITY = 60;

        public const int DEFAULT_NUMBER_TOP_SELLING = 5;

        public const int DELIVERY_FEE = 30000000;

        public const int STORE_IMAGE_LIMIT = 20971520; //20MB

        public const int IMAGE_THUMBNAIL_MAX_EDGES_WEB = 2048;

        public const int IMAGE_THUMBNAIL_MAX_EDGES_MOBILE = 640;

        public const string IMAGE_TYPES_UNSUPPORT_THUMBNAIL = "image/gif,image/webp,image/svg+xml,image/x-icon";

        public static readonly List<EnumPaymentMethod> ALLOW_PAYMENT_METHOD = new()
        {
            EnumPaymentMethod.COD,
            //EnumPaymentMethod.MoMo,
            //EnumPaymentMethod.ZaloPay,
            //EnumPaymentMethod.ShopeePay,
            EnumPaymentMethod.BankTransferVietQR,
            EnumPaymentMethod.VNPayQR,
            EnumPaymentMethod.PayOS,
            EnumPaymentMethod.ATM,
            EnumPaymentMethod.CreditDebitCard,
        };
    }
}