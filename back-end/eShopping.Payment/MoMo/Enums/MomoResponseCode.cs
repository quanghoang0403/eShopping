using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace eShopping.Payment.MoMo.Enums
{
    public class MomoResponseCode
    {
        /// <summary>
        /// Giao dịch thành công
        /// </summary>
        public const string Success = "0";

        public const int PAYMENT_SUCCESS = 0;

        public const int PAYMENT_POS_SUCCESS = 9000;
    }
}
