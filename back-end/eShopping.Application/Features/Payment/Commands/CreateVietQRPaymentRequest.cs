//using eShopping.Common.Extensions;
//using eShopping.Domain.Entities;
//using eShopping.Domain.Enums;
//using eShopping.Domain.Settings;
//using eShopping.Interfaces;
//using eShopping.Payment.VietQR.Models;
//using MediatR;
//using System;
//using System.Threading;
//using System.Threading.Tasks;

//namespace eShopping.Application.Features.Payments.Commands
//{
//    public class CreateVietQRPaymentRequest : IRequest<CreateVietQRPaymentResponse>
//    {
//        public Guid OrderId { get; set; }
//        public QuickLinkModel QuickLinkModel { get; set; }
//    }

//    public class CreateVietQRPaymentResponse
//    {
//        public string PaymentUrl { get; set; }
//    }

//    public class CreateVietQRPaymentRequestHandler : IRequestHandler<CreateVietQRPaymentRequest, CreateVietQRPaymentResponse>
//    {
//        private readonly IUnitOfWork _unitOfWork;
//        private readonly IUserProvider _userProvider;
//        private readonly AppSettings _appSettings;
//        private readonly VietQRSettings _vietQRSettings;

//        public CreateVietQRPaymentRequestHandler(IUnitOfWork unitOfWork, IUserProvider userProvider, AppSettings appSettings, VietQRSettings vietQRSettings)
//        {
//            _unitOfWork = unitOfWork;
//            _userProvider = userProvider;
//            _appSettings = appSettings;
//            _vietQRSettings = appSettings.PaymentSettings.VietQRSettings;
//        }

//        public async Task<CreateVietQRPaymentResponse> Handle(CreateVietQRPaymentRequest request, CancellationToken cancellationToken)
//        {
//            var loggedUser = await _userProvider.ProvideAsync(cancellationToken);
//            var orderTitle = $"Payment for order {request.OrderId}";

//            QuickLinkModel vietQrQuickLink = new(_vietQRSettings.BankCode,
//                                                 _vietQRSettings.BankAccountNumber,
//                                                 _vietQRSettings.BankAccountName,
//                                                 request.QuickLinkModel.Description,
//                                                 request.QuickLinkModel.Amount);

//            var orderPaymentTransaction = new OrderPaymentTransaction()
//            {
//                IsSuccess = false,
//                OrderId = request.OrderId,
//                OrderInfo = orderTitle,
//                Amount = request.QuickLinkModel.Amount,
//                PaymentMethodId = EnumPaymentMethod.BankTransfer,
//                CreatedUser = loggedUser.AccountId.Value,
//                CreatedTime = DateTime.UtcNow,
//                ResponseData = vietQrQuickLink.ToJsonWithCamelCase()
//            };

//            await _unitOfWork.OrderPaymentTransactions.AddAsync(orderPaymentTransaction);
//            // Return data to the client.
//            var response = new CreateVietQRPaymentResponse()
//            {
//                PaymentUrl = vietQrQuickLink.QrUrl
//            };

//            return response;
//        }
//    }
//}
