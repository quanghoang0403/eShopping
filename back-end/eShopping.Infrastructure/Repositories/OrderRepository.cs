using eShopping.Domain.Entities;
using eShopping.Domain.Enums;
using eShopping.Infrastructure.Contexts;
using eShopping.Interfaces.Repositories;

using Microsoft.EntityFrameworkCore;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace eShopping.Infrastructure.Repositories
{
    public class OrderRepository : GenericRepository<Order>, IOrderRepository
    {
        public OrderRepository(eShoppingDbContext dbContext) : base(dbContext)
        {
        }

        public Task<Order> GetOrderByIdAsync(Guid id)
        {
            var order = dbSet.Where(o => o.Id == id)
                .Include(o => o.Customer).ThenInclude(a => a.City)
                .Include(o => o.Customer).ThenInclude(a => a.District)
                .Include(o => o.Customer).ThenInclude(a => a.Ward)

                .Include(o => o.OrderItems).ThenInclude(oi => oi.ProductPrice).ThenInclude(oi => oi.Product)
                .FirstOrDefaultAsync();

            return order;
        }

        public Task<Order> GetOrderItemByOrderIdAsync(Guid id)
        {
            var order = dbSet.Where(o => o.Id == id).FirstOrDefaultAsync();
            return order;
        }

        public Task<List<Order>> GetOrderListByStatus(List<EnumOrderStatus> statuses)
        {
            var orders = dbSet
                .Where(o => statuses.Contains(o.Status)).ToListAsync();
            return orders;
        }


        public Task<List<Order>> GetOrderListByCustomerId(List<Guid> listCustomer)
        {
            var orders = _dbContext.Orders
                .Where(order => listCustomer.Contains(order.Customer.Id)).ToListAsync(); ;
            return orders;
        }
    }
}