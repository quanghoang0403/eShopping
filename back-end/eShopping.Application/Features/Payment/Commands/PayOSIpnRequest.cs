﻿using eShopping.Domain.Enums;
using eShopping.Interfaces;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Net.payOS.Types;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace eShopping.POS.Application.Features.Payments.Commands
{
    public class PayOSIpnRequest : IRequest<PayOSIpnResponse>
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

    public class PayOSIpnRequestHandler : IRequestHandler<PayOSIpnRequest, PayOSIpnResponse>
    {
        private readonly IUnitOfWork _unitOfWork;
        public readonly IHttpContextAccessor _httpContext;

        public PayOSIpnRequestHandler(
            IUnitOfWork unitOfWork,
            IHttpContextAccessor httpContext
        )
        {
            _unitOfWork = unitOfWork;
            _httpContext = httpContext;
        }

        /// <summary>
        /// This method is used to handle the current request.
        /// </summary>
        /// <param name="request">The HTTP data</param>
        /// <param name="cancellationToken">The current thread.</param>
        /// <returns></returns>
        public async Task<PayOSIpnResponse> Handle(PayOSIpnRequest request, CancellationToken cancellationToken)
        {
            string urlForDebugging = _httpContext.HttpContext?.Request?.QueryString.Value;

            // Data to response to the client.
            PayOSIpnResponse res = new PayOSIpnResponse();

            var orderTransaction = await _unitOfWork.OrderPaymentTransactions.GetAll().FirstOrDefaultAsync(opt => opt.TransId == request.data.orderCode);

            if (orderTransaction == null)
            {
                res.Success = false;
                return res;
            }

            // Find order in the database by the order code
            var order = await _unitOfWork.Orders.GetAll()
              .Include(x => x.OrderItems).FirstOrDefaultAsync(o => o.Id == orderTransaction.OrderId);

            // If the order is already in the system, update the current order status.
            if (order != null)
            {
                IQueryCollection queryList = _httpContext.HttpContext.Request.Query;
                bool signatureIsValid = true;

                if (!signatureIsValid)
                {
                    return res;
                }

                if (order.OrderPaymentStatusId == EnumOrderPaymentStatus.Paid && orderTransaction.IsSuccess)
                {
                    return res;
                }

                if (request.data.amount != order.TotalAmount)
                {
                    return res;
                }

                DateTime lastTime = DateTime.UtcNow;
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
                    CreatedTime = DateTime.UtcNow,
                    ActionType = paymentHasBeenCompleted ? EnumOrderActionType.PAID_SUCCESSFULLY : EnumOrderActionType.PAID_FAILED
                };

                res.Success = true;
                _unitOfWork.OrderHistories.Add(orderHistoryAddModel);
            }
            else
            {
                res.Success = false;
            }

            return res;
        }
    }

}
