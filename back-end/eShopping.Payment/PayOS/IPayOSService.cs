using eShopping.Payment.PayOS.Model;
using Net.payOS.Types;
using System.Threading.Tasks;

namespace eShopping.Payment.PayOS
{
    public interface IPayOSService
    {
        Task<CreatePaymentResult> CreatePayment(CreatePaymentRequest request);

        Task<PaymentLinkInformation> GetPaymentLinkInfomation(int orderCode);
    }
}
