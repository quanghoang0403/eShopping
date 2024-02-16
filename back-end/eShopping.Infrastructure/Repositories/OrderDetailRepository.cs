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
    public class OrderDetailRepository : GenericRepository<OrderDetail>, IOrderDetailRepository
    {
        public OrderDetailRepository(eShoppingDbContext dbContext) : base(dbContext) { }

        public async Task<List<OrderDetail>> GetOrderDetailByOrderIdAsync(Guid? orderId)
        {
            var OrderDetails = await dbSet
                .Where(o => (o.OrderId == orderId))
                //.Include(o => o.ProductOption)
                .ToListAsync();

            return OrderDetails;
        }
    }
}
