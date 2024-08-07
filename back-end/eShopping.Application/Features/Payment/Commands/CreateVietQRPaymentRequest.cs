﻿using eShopping.Common.Extensions;
using eShopping.Domain.Entities;
using eShopping.Domain.Enums;
using eShopping.Domain.Settings;
using eShopping.Interfaces;
using eShopping.Payment.VietQR.Models;
using MediatR;
using Microsoft.Extensions.Options;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace eShopping.Application.Features.Payments.Commands
{
    public class CreateVietQRPaymentRequest : IRequest<CreateVietQRPaymentResponse>
    {
        public Guid OrderId { get; set; }

        public int OrderCode { get; set; }

        public string Description { get; set; }

        public decimal Amount { get; set; }
    }

    public class CreateVietQRPaymentResponse
    {
        public string PaymentUrl { get; set; }
    }

    public class CreateVietQRPaymentRequestHandler : IRequestHandler<CreateVietQRPaymentRequest, CreateVietQRPaymentResponse>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IUserProvider _userProvider;
        private readonly AppSettings _appSettings;
        private readonly VietQRSettings _vietQRSettings;

        public CreateVietQRPaymentRequestHandler(IUnitOfWork unitOfWork, IUserProvider userProvider, IOptions<AppSettings> appSettings)
        {
            _unitOfWork = unitOfWork;
            _userProvider = userProvider;
            _appSettings = appSettings.Value;
            _vietQRSettings = _appSettings.PaymentSettings.VietQRSettings;
        }

        public async Task<CreateVietQRPaymentResponse> Handle(CreateVietQRPaymentRequest request, CancellationToken cancellationToken)
        {
            var loggedUser = await _userProvider.ProvideAsync(cancellationToken);
            QuickLinkModel vietQrQuickLink = new(_vietQRSettings.BankCode,
                                                 _vietQRSettings.BankAccountNumber,
                                                 _vietQRSettings.BankAccountName,
                                                 request.Description,
                                                 request.Amount);

            var orderPaymentTransaction = new OrderPaymentTransaction()
            {
                IsSuccess = false,
                Amount = request.Amount,
                OrderId = request.OrderId,
                TransId = request.OrderCode,
                TransactionType = EnumTransactionType.Payment,
                CreatedUser = loggedUser.AccountId.Value,
                CreatedTime = DateTime.Now,
                OrderInfo = $"VietQR Order {request.OrderCode}",
                PaymentMethodId = EnumPaymentMethod.BankTransferVietQR,
                PaymentUrl = vietQrQuickLink.ToJsonWithCamelCase()
            };

            await _unitOfWork.OrderPaymentTransactions.AddAsync(orderPaymentTransaction);

            var response = new CreateVietQRPaymentResponse()
            {
                PaymentUrl = vietQrQuickLink.QrUrl
            };

            return response;
        }
    }
}
