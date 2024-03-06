using eShopping.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace eShopping.Interfaces.Repositories
{
    public interface IOrderItemRepository : IGenericRepository<OrderItem>
    {
        Task<List<OrderItem>> GetOrderItemByOrderIdAsync(Guid? orderId);
    }
}
