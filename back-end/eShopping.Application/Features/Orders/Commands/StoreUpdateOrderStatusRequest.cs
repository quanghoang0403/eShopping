using eShopping.Domain.Enums;
using eShopping.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace GoFoodBeverage.Application.Features.Orders.Commands
{
    public class StoreUpdateOrderStatusRequest : IRequest<bool>
    {
        public Guid OrderId { get; set; }

        public EnumOrderStatus Status { get; set; }

    }

    public class StoreUpdateOrderStatusRequestHandle : IRequestHandler<StoreUpdateOrderStatusRequest, bool>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IUserProvider _userProvider;

        public StoreUpdateOrderStatusRequestHandle(IUnitOfWork unitOfWork, IUserProvider userProvider)
        {
            _unitOfWork = unitOfWork;
            _userProvider = userProvider;
        }

        public async Task<bool> Handle(StoreUpdateOrderStatusRequest request, CancellationToken cancellationToken)
        {
            var loggedUser = await _userProvider.ProvideAsync(cancellationToken);
            var order = await _unitOfWork.Orders.Find(order => order.Id == request.OrderId).FirstOrDefaultAsync(cancellationToken);
            if (order != null)
            {
                order.Status = request.Status;
                order.LastSavedUser = loggedUser.AccountId.Value;
                order.LastSavedTime = DateTime.UtcNow;
                await _unitOfWork.SaveChangesAsync();
            }

            return true;
        }
    }
}
