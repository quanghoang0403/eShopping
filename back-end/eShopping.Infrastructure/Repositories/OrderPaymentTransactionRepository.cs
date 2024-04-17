using eShopping.Domain.Entities;
using eShopping.Infrastructure.Contexts;
using eShopping.Interfaces.Repositories;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace eShopping.Infrastructure.Repositories
{
    public class OrderPaymentTransactionRepository : GenericRepository<OrderPaymentTransaction>, IOrderPaymentTransactionRepository
    {
        public OrderPaymentTransactionRepository(eShoppingDbContext dbContext) : base(dbContext) { }

        public async Task<OrderPaymentTransaction> GetOrderPaymentTransactionById(Guid? id)
        {
            var orderPaymentTransaction = await dbSet.Where(o => o.Id == id).FirstOrDefaultAsync();

            return orderPaymentTransaction;
        }

        public async Task<OrderPaymentTransaction> GetPaymentTransactionByOrderId(Guid? orderId)
        {
            var aPaymentTransaction = await dbSet.SingleOrDefaultAsync(transaction => transaction.OrderId == orderId);

            return aPaymentTransaction;
        }

        public async Task<OrderPaymentTransaction> GetPaymentTransactionByOrderIdAsync(Guid? orderId)
        {
            var result = await dbSet.Where(paymentTransaction => paymentTransaction.OrderId == orderId).FirstOrDefaultAsync();
            return result;
        }
    }
}
