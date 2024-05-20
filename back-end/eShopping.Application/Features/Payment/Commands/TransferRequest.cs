using eShopping.Common.Models;
using eShopping.Domain.Enums;
using eShopping.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace eShopping.POS.Application.Features.Payments.Commands
{
    public class TransferRequest : IRequest<BaseResponseModel>
    {
        public int OrderCode { get; set; }
    }

    public class TransferRequestHandler : IRequestHandler<TransferRequest, BaseResponseModel>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMediator _mediator;
        private readonly IUserProvider _userProvider;

        public TransferRequestHandler(IUnitOfWork unitOfWork, IMediator mediator, IUserProvider userProvider)
        {
            _unitOfWork = unitOfWork;
            _mediator = mediator;
            _userProvider = userProvider;
        }

        public async Task<BaseResponseModel> Handle(TransferRequest request, CancellationToken cancellationToken)
        {
            var loggedUser = new LoggedUserModel();

            var orderTransaction = await _unitOfWork.OrderPaymentTransactions.GetAll().FirstOrDefaultAsync(opt => opt.TransId == request.OrderCode);
            var order = await _unitOfWork.Orders
                .Where(o => o.Id == orderTransaction.OrderId)
                .Include(o => o.OrderItems)
                .FirstOrDefaultAsync(cancellationToken: cancellationToken);
            if (order == null)
            {
                return BaseResponseModel.ReturnError("No order is found");
            }

            DateTime lastTime = DateTime.Now;
            order.OrderPaymentStatusId = EnumOrderPaymentStatus.WaitingForConfirm;
            order.LastSavedTime = lastTime;
            await _unitOfWork.Orders.UpdateAsync(order);

            // Update payment transaction information.
            orderTransaction.IsSuccess = true;
            orderTransaction.LastSavedTime = lastTime;
            await _unitOfWork.OrderPaymentTransactions.UpdateAsync(orderTransaction);
            return BaseResponseModel.ReturnData();
        }
    }
}
