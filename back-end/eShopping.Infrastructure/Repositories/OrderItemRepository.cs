using eShopping.Domain.Entities;
using eShopping.Infrastructure.Contexts;
using eShopping.Interfaces.Repositories;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace eShopping.Infrastructure.Repositories
{
    public class OrderItemRepository : GenericRepository<OrderItem>, IOrderItemRepository
    {
        public OrderItemRepository(eShoppingDbContext dbContext) : base(dbContext) { }

        public async Task<List<OrderItem>> GetOrderItemByOrderIdAsync(Guid? orderId)
        {
            var OrderItems = await dbSet
                .Where(o => (o.OrderId == orderId))
                //.Include(o => o.ProductPrice)
                .ToListAsync();

            return OrderItems;
        }
    }
}
