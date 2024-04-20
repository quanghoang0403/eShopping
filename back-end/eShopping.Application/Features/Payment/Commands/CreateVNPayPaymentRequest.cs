﻿using eShopping.Common.Constants;
using eShopping.Domain.Entities;
using eShopping.Domain.Enums;
using eShopping.Interfaces;
using eShopping.Payment.VNPay;
using eShopping.Payment.VNPay.Model;
using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace eShopping.Application.Features.Payments.Commands
{
    public class CreateVNPayPaymentRequest : IRequest<CreateVNPayPaymentResponse>
    {
        public string VNPayBankCode { get; set; }

        public decimal Amount { get; set; }

        public Guid OrderId { get; set; }
    }

    public class CreateVNPayPaymentResponse
    {
        public string PaymentUrl { get; set; }
    }

    public class CreateVNPayPaymentRequestHandler : IRequestHandler<CreateVNPayPaymentRequest, CreateVNPayPaymentResponse>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IUserProvider _userProvider;
        private readonly IVNPayService _vnPayService;

        public CreateVNPayPaymentRequestHandler(IUnitOfWork unitOfWork, IUserProvider userProvider, IVNPayService vnPayService)
        {
            _unitOfWork = unitOfWork;
            _userProvider = userProvider;
            _vnPayService = vnPayService;
        }

        public async Task<CreateVNPayPaymentResponse> Handle(CreateVNPayPaymentRequest request, CancellationToken cancellationToken)
        {
            var loggedUser = await _userProvider.ProvideAsync(cancellationToken);
            var orderInfo = new VNPayOrderInfoModel()
            {
                PaymentTranId = DateTime.Now.Ticks,
                Title = $"Payment for order {request.OrderId}",
                Amount = request.Amount,
                CreatedDate = DateTime.UtcNow,
                BankCode = request.VNPayBankCode,
                CurrencyCode = SystemConstants.CurrencyCode,
                Locale = SystemConstants.LocaleDefault,
                ReturnUrl = SystemConstants.VnPayRedirectUrl
            };

            // Call the VNPay's service.
            var paymentUrl = await _vnPayService.CreatePaymentUrlAsync(orderInfo);

            // Add a new payment transaction.
            var orderPaymentTransaction = new OrderPaymentTransaction()
            {
                IsSuccess = false,
                OrderInfo = orderInfo.Title,
                Amount = request.Amount,
                OrderId = request.OrderId,
                TransId = orderInfo.PaymentTranId,
                PaymentMethodId = EnumPaymentMethod.VNPay,
                PaymentUrl = paymentUrl,
                TransactionType = EnumTransactionType.Payment,
                CreatedUser = loggedUser.AccountId.Value,
                CreatedTime = orderInfo.CreatedDate,
            };

            // Save payment transaction.
            await _unitOfWork.OrderPaymentTransactions.AddAsync(orderPaymentTransaction);

            // Return data to the client.
            var response = new CreateVNPayPaymentResponse()
            {
                PaymentUrl = paymentUrl,
            };

            return response;
        }
    }
}