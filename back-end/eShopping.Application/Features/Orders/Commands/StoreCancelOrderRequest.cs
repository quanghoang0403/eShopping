using eShopping.Domain.Entities;
using eShopping.Domain.Enums;
using eShopping.Interfaces;
using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace eShopping.Application.Features.Orders.Commands
{
    public class StoreCancelOrderRequest : IRequest<bool>
    {
        public Guid OrderId { get; set; }

        public string CancelReason { get; set; }

    }

    public class StoreUpdateOrderStatusRequestHandle : IRequestHandler<StoreCancelOrderRequest, bool>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IUserProvider _userProvider;

        public StoreUpdateOrderStatusRequestHandle(IUnitOfWork unitOfWork, IUserProvider userProvider)
        {
            _unitOfWork = unitOfWork;
            _userProvider = userProvider;
        }

        public async Task<bool> Handle(StoreCancelOrderRequest request, CancellationToken cancellationToken)
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

            return true;
        }
    }
}
