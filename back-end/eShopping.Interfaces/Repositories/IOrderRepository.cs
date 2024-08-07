﻿using eShopping.Domain.Entities;
using eShopping.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace eShopping.Interfaces.Repositories
{
    public interface IOrderRepository : IGenericRepository<Order>
    {
        Task<Order> GetOrderByIdAsync(Guid id);

        Task<Order> GetOrderItemByOrderIdAsync(Guid id);

        Task<List<Order>> GetOrderListByStatus(List<EnumOrderStatus> statuses);

        Task<List<Order>> GetOrderListByCustomerId(List<Guid> listCustomer);
    }
}