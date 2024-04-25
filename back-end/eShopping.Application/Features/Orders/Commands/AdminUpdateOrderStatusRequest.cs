using eShopping.Domain.Entities;
using eShopping.Domain.Enums;
using eShopping.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace eShopping.Application.Features.Orders.Commands
{
    public class AdminUpdateOrderStatusRequest : IRequest<bool>
    {
        public Guid OrderId { get; set; }

        public EnumOrderStatus Status { get; set; }

        public string Note { get; set; }
    }

    public class AdminUpdateOrderStatusRequestHandle : IRequestHandler<AdminUpdateOrderStatusRequest, bool>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IUserProvider _userProvider;

        public AdminUpdateOrderStatusRequestHandle(IUnitOfWork unitOfWork, IUserProvider userProvider)
        {
            _unitOfWork = unitOfWork;
            _userProvider = userProvider;
        }

        public async Task<bool> Handle(AdminUpdateOrderStatusRequest request, CancellationToken cancellationToken)
        {
            var loggedUser = await _userProvider.ProvideAsync(cancellationToken);
            var accountId = loggedUser.AccountId.Value;
            var order = await _unitOfWork.Orders.Find(order => order.Id == request.OrderId).FirstOrDefaultAsync(cancellationToken);
            if (order != null)
            {
                order.Status = request.Status;
                order.LastSavedUser = accountId;
                order.LastSavedTime = DateTime.UtcNow;
            }

            // Add order history
            var orderHistory = await _unitOfWork.OrderHistories.AddAsync(new OrderHistory()
            {
                OrderId = order.Id,
                ActionType = EnumOrderActionType.CANCEL,
                Note = request.Note,
                CreatedTime = DateTime.UtcNow,
                CreatedUser = accountId,
            });

            await _unitOfWork.SaveChangesAsync();

            return true;
        }
    }
}
