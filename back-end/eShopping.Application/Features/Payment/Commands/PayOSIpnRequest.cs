using eShopping.Common.Models;
using eShopping.Domain.Enums;
using eShopping.Interfaces;
using eShopping.Payment.PayOS;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Net.payOS.Types;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace eShopping.POS.Application.Features.Payments.Commands
{
    public class PayOSIpnRequest : IRequest<BaseResponseModel>
    {
        public string code { get; set; }
        public string desc { get; set; }
        public WebhookData data { get; set; }
        public string signature { get; set; }
    }

    public class PayOSIpnResponse
    {
        public bool Success { get; set; }
    }

    public class PayOSIpnRequestHandler : IRequestHandler<PayOSIpnRequest, BaseResponseModel>
    {
        private readonly IUnitOfWork _unitOfWork;
        public readonly IHttpContextAccessor _httpContext;
        private readonly IPayOSService _payOSService;


        public PayOSIpnRequestHandler(
            IUnitOfWork unitOfWork,
            IHttpContextAccessor httpContext,
            IPayOSService payOSService
        )
        {
            _unitOfWork = unitOfWork;
            _httpContext = httpContext;
            _payOSService = payOSService;
        }

        /// <summary>
        /// This method is used to handle the current request.
        /// </summary>
        /// <param name="request">The HTTP data</param>
        /// <param name="cancellationToken">The current thread.</param>
        /// <returns></returns>
        public async Task<BaseResponseModel> Handle(PayOSIpnRequest request, CancellationToken cancellationToken)
        {
            string urlForDebugging = _httpContext.HttpContext?.Request?.QueryString.Value;

            // Data to response to the client.
            PayOSIpnResponse res = new PayOSIpnResponse();

            var orderTransaction = await _unitOfWork.OrderPaymentTransactions.GetAll().FirstOrDefaultAsync(opt => opt.TransId == request.data.orderCode);

            if (orderTransaction == null)
            {
                res.Success = false;
                return BaseResponseModel.ReturnData(res);
            }

            // Find order in the database by the order code
            var order = await _unitOfWork.Orders.GetAll()
              .Include(x => x.OrderItems).FirstOrDefaultAsync(o => o.Id == orderTransaction.OrderId);

            // If the order is already in the system, update the current order status.
            if (order != null)
            {
                IQueryCollection queryList = _httpContext.HttpContext.Request.Query;
                bool signatureIsValid = _payOSService.VerifySignature(request.data, request.signature);

                if (!signatureIsValid)
                {
                    return BaseResponseModel.ReturnData(res);
                }

                if (order.OrderPaymentStatusId == EnumOrderPaymentStatus.Paid && orderTransaction.IsSuccess)
                {
                    return BaseResponseModel.ReturnData(res);
                }

                if (request.data.amount != order.TotalAmount)
                {
                    return BaseResponseModel.ReturnData(res);
                }

                DateTime lastTime = DateTime.Now;
                //Handle update order and payment status
                bool paymentHasBeenCompleted = request.code == "00" ? true : false;
                order.OrderPaymentStatusId = paymentHasBeenCompleted ? EnumOrderPaymentStatus.Paid : EnumOrderPaymentStatus.Unpaid;

                order.LastSavedTime = lastTime;
                await _unitOfWork.Orders.UpdateAsync(order);

                // Update payment transaction information.
                orderTransaction.IsSuccess = paymentHasBeenCompleted;
                orderTransaction.LastSavedTime = lastTime;
                orderTransaction.ResponseData = urlForDebugging;
                await _unitOfWork.OrderPaymentTransactions.UpdateAsync(orderTransaction);

                // Save order history
                var orderHistoryAddModel = new Domain.Entities.OrderHistory
                {
                    OrderId = order.Id,
                    Note = urlForDebugging,
                    CreatedTime = DateTime.Now,
                    ActionType = paymentHasBeenCompleted ? EnumOrderActionType.PAID_SUCCESSFULLY : EnumOrderActionType.PAID_FAILED
                };

                res.Success = true;
                _unitOfWork.OrderHistories.Add(orderHistoryAddModel);
            }
            else
            {
                res.Success = false;
            }

            return BaseResponseModel.ReturnData(res);
        }
    }

}
