using eShopping.Common.Constants;
using eShopping.Common.Models;
using eShopping.Domain.Entities;
using eShopping.Domain.Enums;
using eShopping.Interfaces;
using eShopping.Services.Hubs;
using MediatR;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace eShopping.Application.Features.Orders.Commands
{
    public class StoreCancelOrderRequest : IRequest<BaseResponseModel>
    {
        public Guid OrderId { get; set; }

        public string CancelReason { get; set; }

    }

    public class StoreUpdateOrderStatusRequestHandle : IRequestHandler<StoreCancelOrderRequest, BaseResponseModel>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IUserProvider _userProvider;
        private readonly IHubContext<OrderHub> _hubContext;

        public StoreUpdateOrderStatusRequestHandle(IUnitOfWork unitOfWork, IUserProvider userProvider, IHubContext<OrderHub> hubContext)
        {
            _unitOfWork = unitOfWork;
            _userProvider = userProvider;
            _hubContext = hubContext;
        }

        public async Task<BaseResponseModel> Handle(StoreCancelOrderRequest request, CancellationToken cancellationToken)
        {
            var loggedUser = await _userProvider.ProvideAsync(cancellationToken);
            var accountId = loggedUser.AccountId.Value;
            var order = await _unitOfWork.Orders.GetOrderItemByOrderIdAsync(request.OrderId);
            if (order != null)
            {
                order.Status = EnumOrderStatus.Canceled;
                order.LastSavedUser = accountId;
                order.LastSavedTime = DateTime.Now;
            }

            // Add order history
            var orderHistory = await _unitOfWork.OrderHistories.AddAsync(new OrderHistory()
            {
                OrderId = order.Id,
                ActionType = EnumOrderActionType.CANCEL,
                CancelReason = request.CancelReason,
                CreatedTime = DateTime.Now,
                CreatedUser = accountId,
            });

            await _unitOfWork.SaveChangesAsync();
            await _hubContext.Clients.All.SendAsync(OrderHubConstants.UPDATE_STATUS_BY_CUSTOMER, order.Id, EnumOrderActionType.CANCEL);
            return BaseResponseModel.ReturnData();
        }
    }
}
