using eShopping.Common.Constants;
using eShopping.Domain.Enums;
using eShopping.Interfaces;
using eShopping.Payment.VNPay;
using eShopping.Payment.VNPay.Enums;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace eShopping.POS.Application.Features.Payments.Commands
{
    public class VnPayIpnRequest : IRequest<VnPayIpnResponse>
    {
        [FromQuery(Name = "vnp_Amount")]
        public long Amount { get; set; }

        [FromQuery(Name = "vnp_BankCode")]
        public string BankCode { get; set; }

        [FromQuery(Name = "vnp_BankTranNo")]
        public string BankTranNo { get; set; }

        [FromQuery(Name = "vnp_CardType")]
        public string CardType { get; set; }

        [FromQuery(Name = "vnp_OrderInfo")]
        public string OrderInfo { get; set; }

        [FromQuery(Name = "vnp_PayDate")]
        public string PayDate { get; set; }

        [FromQuery(Name = "vnp_ResponseCode")]
        public string ResponseCode { get; set; }

        [FromQuery(Name = "vnp_SecureHash")]
        public string SecureHash { get; set; }

        [FromQuery(Name = "vnp_SecureHashType")]
        public string SecureHashType { get; set; }

        [FromQuery(Name = "vnp_TmnCode")]
        public string TerminalId { get; set; }

        [FromQuery(Name = "vnp_TransactionNo")]
        public string TransactionNo { get; set; }

        [FromQuery(Name = "vnp_TransactionStatus")]
        public string TransactionStatus { get; set; }

        [FromQuery(Name = "vnp_TxnRef")]
        public string TxnRef { get; set; }

    }

    public class VnPayIpnResponse
    {
        public string RspCode { get; set; }

        public string Message { get; set; }
    }

    public class VnPayIpnRequestHandler : IRequestHandler<VnPayIpnRequest, VnPayIpnResponse>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IVNPayService _vnPayService;
        public readonly IHttpContextAccessor _httpContext;

        public VnPayIpnRequestHandler(
            IUnitOfWork unitOfWork,
            IVNPayService vnPayService,
            IHttpContextAccessor httpContext
        )
        {
            _unitOfWork = unitOfWork;
            _httpContext = httpContext;
            _vnPayService = vnPayService;
        }

        /// <summary>
        /// This method is used to handle the current request.
        /// </summary>
        /// <param name="request">The HTTP data</param>
        /// <param name="cancellationToken">The current thread.</param>
        /// <returns></returns>
        public async Task<VnPayIpnResponse> Handle(VnPayIpnRequest request, CancellationToken cancellationToken)
        {
            long transactionId = 0;
            long.TryParse(request.TxnRef, out transactionId);

            string urlForDebugging = _httpContext.HttpContext?.Request?.QueryString.Value;

            // Data to response to the client.
            VnPayIpnResponse vnPayIpnResponse = new VnPayIpnResponse();

            var orderTransaction = transactionId == 0 ? null : await _unitOfWork.
                OrderPaymentTransactions.
                GetAll().
                FirstOrDefaultAsync(opt => opt.TransId == transactionId);

            if (orderTransaction == null)
            {
                vnPayIpnResponse.RspCode = VnPayIpnConstants.Code.ORDER_NOT_FOUND;
                vnPayIpnResponse.Message = VnPayIpnConstants.Message.ORDER_NOT_FOUND;
                return vnPayIpnResponse;
            }

            // Find order in the database by the order code, for example: 70
            var order = await _unitOfWork.Orders.GetAll()
              .Include(x => x.OrderItems).FirstOrDefaultAsync(o => o.Id == orderTransaction.OrderId);

            // If the order is already in the system, update the current order status.
            if (order != null)
            {
                IQueryCollection queryList = _httpContext.HttpContext.Request.Query;
                bool signatureIsValid = _vnPayService.ValidateSignature(queryList, request.SecureHash);

                if (!signatureIsValid)
                {
                    vnPayIpnResponse.RspCode = VnPayIpnConstants.Code.INVALID_SIGNATURE;
                    vnPayIpnResponse.Message = VnPayIpnConstants.Message.INVALID_SIGNATURE;
                    return vnPayIpnResponse;
                }

                if (order.OrderPaymentStatusId == EnumOrderPaymentStatus.Paid && orderTransaction.IsSuccess)
                {
                    vnPayIpnResponse.RspCode = VnPayIpnConstants.Code.ORDER_ALREADY_CONFIRMED;
                    vnPayIpnResponse.Message = VnPayIpnConstants.Message.ORDER_ALREADY_CONFIRMED;
                    return vnPayIpnResponse;
                }

                if (request.Amount != Convert.ToInt64(order.TotalAmount) * 100)
                {
                    vnPayIpnResponse.RspCode = VnPayIpnConstants.Code.INVALID_AMOUNT;
                    vnPayIpnResponse.Message = VnPayIpnConstants.Message.INVALID_AMOUNT;
                    return vnPayIpnResponse;
                }

                DateTime lastTime = DateTime.Now;
                //Handle update order and payment status
                bool paymentHasBeenCompleted = request.ResponseCode == VNPayResponseCode.Success && request.TransactionStatus == VNPayResponseCode.Success ? true : false;
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

                vnPayIpnResponse.RspCode = VnPayIpnConstants.Code.SUCCESS;
                vnPayIpnResponse.Message = VnPayIpnConstants.Message.SUCCESS;

                _unitOfWork.OrderHistories.Add(orderHistoryAddModel);
            }
            else
            {
                vnPayIpnResponse.RspCode = VnPayIpnConstants.Code.ORDER_NOT_FOUND;
                vnPayIpnResponse.Message = VnPayIpnConstants.Message.ORDER_NOT_FOUND;
            }

            return vnPayIpnResponse;
        }
    }

}
