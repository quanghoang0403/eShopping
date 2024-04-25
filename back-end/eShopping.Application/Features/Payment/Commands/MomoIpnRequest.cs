using eShopping.Common.Models.User;
using eShopping.Domain.Enums;
using eShopping.Interfaces;
using eShopping.Payment.MoMo.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace eShopping.POS.Application.Features.Payments.Commands
{
    public class MomoIpnRequest : IRequest<bool>
    {
        public string PartnerCode { get; set; }

        public Guid OrderId { get; set; }

        public string RequestId { get; set; }

        public decimal Amount { get; set; }

        public string OrderInfo { get; set; }

        public string OrderType { get; set; }

        public long? TransId { get; set; }

        public string ResultCode { get; set; }

        public string Message { get; set; }

        public string PayType { get; set; }

        public long ResponseTime { get; set; }

        public string ExtraData { get; set; }

        public string Signature { get; set; }
    }

    public class MomoIpnRequestHandler : IRequestHandler<MomoIpnRequest, bool>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMediator _mediator;
        private readonly IUserProvider _userProvider;

        public MomoIpnRequestHandler(IUnitOfWork unitOfWork, IMediator mediator, IUserProvider userProvider)
        {
            _unitOfWork = unitOfWork;
            _mediator = mediator;
            _userProvider = userProvider;
        }

        public async Task<bool> Handle(MomoIpnRequest request, CancellationToken cancellationToken)
        {
            var loggedUser = new LoggedUserModel();

            var orderTransaction = await _unitOfWork.OrderPaymentTransactions.GetAll().FirstOrDefaultAsync(opt => opt.TransId == request.TransId);
            var order = await _unitOfWork.Orders
                .Where(o => o.Id == orderTransaction.OrderId)
                .Include(o => o.OrderItems)
                .FirstOrDefaultAsync(cancellationToken: cancellationToken);

            // If the order is already in the system, update the current order status.
            if (order != null)
            {
                bool signatureIsValid = true;
                if (!signatureIsValid)
                {
                    return false;
                }

                if (order.OrderPaymentStatusId == EnumOrderPaymentStatus.Paid && orderTransaction.IsSuccess)
                {
                    return false;
                }

                if (request.Amount != order.TotalAmount)
                {
                    return false;
                }

                DateTime lastTime = DateTime.Now;
                //Handle update order and payment status
                bool paymentHasBeenCompleted = request.ResultCode == MomoResponseCode.Success ? true : false;
                order.OrderPaymentStatusId = paymentHasBeenCompleted ? EnumOrderPaymentStatus.Paid : EnumOrderPaymentStatus.Unpaid;

                order.LastSavedTime = lastTime;
                await _unitOfWork.Orders.UpdateAsync(order);

                // Update payment transaction information.
                orderTransaction.IsSuccess = paymentHasBeenCompleted;
                orderTransaction.LastSavedTime = lastTime;
                orderTransaction.ResponseData = JsonConvert.SerializeObject(request);
                await _unitOfWork.OrderPaymentTransactions.UpdateAsync(orderTransaction);

                // Save order history
                var orderHistoryAddModel = new Domain.Entities.OrderHistory
                {
                    OrderId = order.Id,
                    CreatedTime = DateTime.Now,
                    ActionType = paymentHasBeenCompleted ? EnumOrderActionType.PAID_SUCCESSFULLY : EnumOrderActionType.PAID_FAILED
                };
                _unitOfWork.OrderHistories.Add(orderHistoryAddModel);
                return true;
            }
            else
            {
                return true;
            }
        }
    }
}
