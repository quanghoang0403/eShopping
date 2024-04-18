using eShopping.Domain.Entities;
using System;
using System.Threading.Tasks;

namespace eShopping.Interfaces.Repositories
{
    public interface IOrderPaymentTransactionRepository : IGenericRepository<OrderPaymentTransaction>
    {
        Task<OrderPaymentTransaction> GetOrderPaymentTransactionById(Guid? id);

        Task<OrderPaymentTransaction> GetPaymentTransactionByOrderId(Guid? orderId);

        Task<OrderPaymentTransaction> GetPaymentTransactionByOrderIdAsync(Guid? orderId);
    }
}
