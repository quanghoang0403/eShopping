using eShopping.Common.Constants;
using eShopping.Domain.Entities;
using eShopping.Domain.Enums;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace eShopping.Services.Hubs
{
    public class OrderHub : Hub
    {
        public async Task SendCreateOrderByCustomer(object orderDetails)
        {
            await Clients.All.SendAsync(OrderHubConstants.CREATE_ORDER_BY_CUSTOMER, orderDetails);
        }

        public async Task SendUpdateStatusToCustomer(Guid orderId, EnumOrderStatus status)
        {
            await Clients.All.SendAsync(OrderHubConstants.UPDATE_STATUS_BY_CUSTOMER, orderId, status);
        }
        public async Task SendUpdateOrderToCustomer(object orderDetails)
        {
            await Clients.All.SendAsync(OrderHubConstants.UPDATE_ORDER_BY_CUSTOMER, orderDetails);
        }

        public async Task SendUpdateOrderByStaff(Guid customerId, object orderDetails)
        {
            await Clients.Client(customerId.ToString()).SendAsync(OrderHubConstants.UPDATE_ORDER_BY_STAFF, orderDetails);
        }

        public async Task SendUpdateStatusByStaff(Guid customerId, Guid orderId, EnumOrderStatus status)
        {
            await Clients.Client(customerId.ToString()).SendAsync(OrderHubConstants.UPDATE_STATUS_BY_STAFF, orderId, status);
        }
    }
}
