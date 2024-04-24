using eShopping.Common.Constants;
using eShopping.Domain.Entities;
using eShopping.Domain.Enums;
using eShopping.Interfaces;
using eShopping.Payment.PayOS;
using eShopping.Payment.PayOS.Model;
using MediatR;
using Net.payOS.Types;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace eShopping.Application.Features.Payments.Commands
{
    public class CreatePayOSPaymentRequest : IRequest<CreatePayOSPaymentResponse>
    {
        public Guid OrderId { get; set; }
        public int OrderCode { get; set; }
        public int Amount { get; set; }
        public IEnumerable<OrderItem> OrderItems { get; set; }
    }

    public class CreatePayOSPaymentResponse
    {
        public string PaymentUrl { get; set; }
    }

    public class CreatePayOSPaymentRequestHandler : IRequestHandler<CreatePayOSPaymentRequest, CreatePayOSPaymentResponse>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IUserProvider _userProvider;
        private readonly IPayOSService _payOSService;

        public CreatePayOSPaymentRequestHandler(IUnitOfWork unitOfWork, IUserProvider userProvider, IPayOSService vnPayService)
        {
            _unitOfWork = unitOfWork;
            _userProvider = userProvider;
            _payOSService = vnPayService;
        }

        public async Task<CreatePayOSPaymentResponse> Handle(CreatePayOSPaymentRequest request, CancellationToken cancellationToken)
        {
            var loggedUser = await _userProvider.ProvideAsync(cancellationToken);

            var items = new List<ItemData>();
            foreach (var orderItem in request.OrderItems)
            {
                items.Add(new ItemData($"{orderItem.ProductName} - {orderItem.PriceName}", orderItem.Quantity, Convert.ToInt32(orderItem.TotalPrice)));
            }
            var requestPayment = new CreatePaymentRequest()
            {
                OrderId = request.OrderId,
                OrderCode = request.OrderCode,
                Amount = request.Amount,
                Description = $"PayOS Order {request.OrderCode}",
                Items = items,
                ReturnUrl = SystemConstants.PayOSIpnUrl,
                CancelUrl = SystemConstants.PayOSRedirectUrl
            };

            // Call the PayOS's service.
            var result = await _payOSService.CreatePayment(requestPayment);

            // Add a new payment transaction.
            var orderPaymentTransaction = new OrderPaymentTransaction()
            {
                IsSuccess = false,
                Amount = request.Amount,
                OrderId = request.OrderId,
                TransId = request.OrderCode,
                TransactionType = EnumTransactionType.Payment,
                CreatedUser = loggedUser.AccountId.Value,
                CreatedTime = DateTime.UtcNow,
                OrderInfo = requestPayment.Description,
                PaymentMethodId = EnumPaymentMethod.PayOS,
                PaymentUrl = result.checkoutUrl,
            };

            // Save payment transaction.
            await _unitOfWork.OrderPaymentTransactions.AddAsync(orderPaymentTransaction);

            // Return data to the client.
            var response = new CreatePayOSPaymentResponse()
            {
                PaymentUrl = result.checkoutUrl,
            };

            return response;
        }
    }
}
