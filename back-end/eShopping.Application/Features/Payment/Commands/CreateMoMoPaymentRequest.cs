using eShopping.Common.Constants;
using eShopping.Domain.Entities;
using eShopping.Domain.Enums;
using eShopping.Domain.Settings;
using eShopping.Interfaces;
using eShopping.Loging.Serilog;
using eShopping.Payment.MoMo;
using eShopping.Payment.MoMo.Model;
using MediatR;
using Microsoft.Extensions.Options;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace eShopping.Application.Features.Payments.Commands
{
    public class CreateMoMoPaymentRequest : IRequest<CreateMomoResponseModel>
    {
        public string Amount { get; set; }

        public int OrderCode { get; set; }

        public Guid OrderId { get; set; }
    }

    public class CreateNormalPaymentRequestHandler : IRequestHandler<CreateMoMoPaymentRequest, CreateMomoResponseModel>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMoMoPaymentService _momoPaymentService;
        private readonly IUserProvider _userProvider;
        private readonly MoMoSettings _momoSettings;
        private readonly AppSettings _appSettings;

        public CreateNormalPaymentRequestHandler(
            IUnitOfWork unitOfWork,
            IMoMoPaymentService momoPaymentService,
            IUserProvider userProvider,
            IOptions<AppSettings> appSettings)
        {
            _unitOfWork = unitOfWork;
            _momoPaymentService = momoPaymentService;
            _userProvider = userProvider;
            _appSettings = appSettings.Value;
            _momoSettings = _appSettings.PaymentSettings.MoMoSettings;
        }

        public async Task<CreateMomoResponseModel> Handle(CreateMoMoPaymentRequest request, CancellationToken cancellationToken)
        {
            var loggedUser = await _userProvider.ProvideAsync(cancellationToken);
            var info = $"Momo Order {request.OrderCode} amount: {request.Amount}";
            //Handle Payment Request
            var paymentRequest = new CreateMomoRequestModel()
            {
                RequestId = request.OrderCode.ToString(),
                Amount = request.Amount,
                OrderCode = request.OrderCode.ToString(),
                OrderInfo = info,
                RedirectUrl = SystemConstants.MomoRedirectUrl,
                IpnUrl = SystemConstants.MomoIpnUrl,
                PartnerClientId = loggedUser.Email,
                ExtraData = info,
                Language = SystemConstants.Locale
            };

            try
            {
                var response = await _momoPaymentService.CreateGatewayAsync(paymentRequest);

                var orderPaymentTransaction = new OrderPaymentTransaction()
                {
                    IsSuccess = false,
                    Amount = decimal.Parse(request.Amount),
                    OrderId = request.OrderId,
                    TransId = request.OrderCode,
                    TransactionType = EnumTransactionType.Payment,
                    CreatedUser = loggedUser.AccountId.Value,
                    CreatedTime = DateTime.Now,
                    OrderInfo = paymentRequest.OrderInfo,
                    PaymentMethodId = EnumPaymentMethod.MoMo,
                    PaymentUrl = response.QrCodeUrl
                };
                await _unitOfWork.OrderPaymentTransactions.AddAsync(orderPaymentTransaction);
                return response;
            }
            catch (Exception e)
            {
                e.AddTraceLog(nameof(Exception));
                paymentRequest.AddTraceLog(nameof(Exception));
                throw;
            }
        }

        public static string Base64Encode(string plainText)
        {
            var plainTextBytes = System.Text.Encoding.UTF8.GetBytes(plainText);
            return System.Convert.ToBase64String(plainTextBytes);
        }
    }
}
