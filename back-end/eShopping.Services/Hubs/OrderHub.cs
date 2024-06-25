using eShopping.Common.Constants;
using eShopping.Domain.Enums;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace eShopping.Services.Hubs
{
    public class OrderHub : Hub
    {
        public async Task SendReceiveOrder(Guid orderId, object orderDetails)
        {
            await Clients.All.SendAsync(OrderHubConstants.RECEIVE_ORDER, orderId, orderDetails);
        }

        public async Task SendUpdateOrder(Guid orderId, object orderDetails)
        {
            await Clients.All.SendAsync(OrderHubConstants.UPDATE_ORDER_BY_CUSTOMER, orderId, orderDetails);
        }

        public async Task SendUpdateStatus(Guid orderId, EnumOrderStatus status)
        {
            await Clients.All.SendAsync(OrderHubConstants.UPDATE_STATUS_BY_CUSTOMER, orderId, status);

            await Clients.All.SendAsync(OrderHubConstants.UPDATE_STATUS_BY_STAFF, orderId, status);
        }
    }
}
