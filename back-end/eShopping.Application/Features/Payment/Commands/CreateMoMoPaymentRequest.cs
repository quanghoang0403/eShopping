//using eShopping.Common.Extensions;
//using eShopping.Domain.Entities;
//using eShopping.Domain.Enums;
//using eShopping.Domain.Settings;
//using eShopping.Interfaces;
//using eShopping.Loging.Serilog;
//using eShopping.Payment.MoMo.Model;
//using MediatR;
//using Microsoft.EntityFrameworkCore;
//using Microsoft.Extensions.Options;
//using Newtonsoft.Json.Linq;
//using System;
//using System.Linq;
//using System.Threading;
//using System.Threading.Tasks;

//namespace eShopping.Application.Features.Payments.Commands
//{
//    public class CreateMoMoPaymentRequest : IRequest<CreateMomoResponseModel>
//    {
//        public string Amount { get; set; }

//        public string OrderCode { get; set; }

//        public string RedirectUrl { get; set; }

//        public Guid OrderId { get; set; }

//        public Guid? StoreId { get; set; }

//        public Guid? BranchId { get; set; }

//        public EnumPlatform? Platform { get; set; }

//        public string Language { get; set; }

//        public string MoMoPaymentType { get; set; }

//        public Guid? AccountId { get; set; }

//        public string EmailAddress { get; set; }

//        public string RequestType { get; set; }
//    }

//    public class CreateNormalPaymentRequestHandler : IRequestHandler<CreateMoMoPaymentRequest, CreateMomoResponseModel>
//    {
//        private readonly IUnitOfWork _unitOfWork;
//        private readonly IMoMoPaymentService _momoPaymentService;
//        private readonly IPaymentService _paymentService;
//        private readonly IUserProvider _userProvider;
//        private readonly MoMoSettings _momoSettings;
//        private readonly AppSettings _appSettings;

//        public CreateNormalPaymentRequestHandler(
//            IUnitOfWork unitOfWork,
//            IMoMoPaymentService momoPaymentService,
//            IPaymentService paymentService,
//            IUserProvider userProvider,
//            IOptions<AppSettings> appSettings)
//        {
//            _unitOfWork = unitOfWork;
//            _momoPaymentService = momoPaymentService;
//            _paymentService = paymentService;
//            _userProvider = userProvider;
//            _appSettings = appSettings.Value;
//            _momoSettings = _appSettings.PaymentSettings.MoMoSettings;
//        }

//        public async Task<CreateMomoResponseModel> Handle(CreateMoMoPaymentRequest request, CancellationToken cancellationToken)
//        {
//            var storeId = request.StoreId;
//            var branchId = request.BranchId;
//            Guid? accountId = request.AccountId;
//            string email = request.EmailAddress;

//            if (storeId == null || branchId == null)
//            {
//                var loggedUser = await _userProvider.ProvideAsync(cancellationToken);
//                storeId = loggedUser.StoreId;
//                branchId = loggedUser.BranchId;
//            }

//            var paymentConfigMomo = await _unitOfWork.PaymentConfigs.GetPaymentConfigAsync(storeId.Value, EnumPaymentMethod.MoMo);
//            var storeInfo = await _unitOfWork.StoreBranches.Where(x => x.StoreId == storeId && x.Id == branchId.Value)
//                .Include(x => x.Store)
//                .Select(x => new
//                {
//                    StoreName = x.Store.Title,
//                    BranchName = x.Name,
//                })
//                .FirstOrDefaultAsync();

//            var storeName = storeInfo != null ? storeInfo.StoreName : "";
//            var branchName = storeInfo != null ? storeInfo.BranchName : "";

//            var config = await _paymentService.GetMoMoPaymentConfigAsync(storeId.Value);

//            /// setup momo ipn
//            var ipnUrl = _paymentService.GetIpnUrl(EnumPlatform.POS);
//            if (request.Platform.HasValue)
//            {
//                switch (request.Platform)
//                {
//                    case EnumPlatform.StoreWebsite:
//                        ipnUrl = _paymentService.GetIpnUrl(EnumPlatform.StoreWebsite);
//                        break;
//                }
//            }

//            CreateGetwayRequestModel paymentRequest;

//            bool isPlatformPOS = _userProvider.GetPlatformId() == EnumPlatform.POS.ToGuid().ToString();
//            switch (request.MoMoPaymentType)
//            {
//                case MoMoPaymentTypeConstants.ReserveTable:
//                    paymentRequest = await CreateReserveTablePaymentTransactionAsync(request, accountId, storeId, storeName, branchName, ipnUrl, email);
//                    break;
//                default:
//                    paymentRequest = await CreateOrderPaymentTransactionAsync(request, accountId, storeName, branchName, ipnUrl, email, isPlatformPOS);
//                    break;
//            }

//            /// Thanh Toán Thông Thường
//            /// https://developers.momo.vn/v3/vi/docs/payment/api/wallet/onetime
//            try
//            {
//                var response = await _momoPaymentService.CreateGatewayAsync(config, paymentRequest, string.IsNullOrEmpty(request.RequestType) ? RequestTypes.CaptureWallet : request.RequestType);
//                return response;
//            }
//            catch (Exception e)
//            {
//                //Log Momo detail failure
//                e.AddTraceLog(nameof(Exception));
//                config.AddTraceLog(nameof(Exception));
//                paymentRequest.AddTraceLog(nameof(Exception));

//                throw;
//            }
//        }

//        private async Task<CreateGetwayRequestModel> CreateReserveTablePaymentTransactionAsync(
//            CreateMoMoPaymentRequest request,
//            Guid? accountId,
//            Guid? storeId,
//            string storeName,
//            string branchName,
//            string ipnUrl,
//            string email)
//        {
//            var reserveTableInfo = $"Payment for reserve table at {storeName} - {branchName}";
//            //Handle Create OrderPaymentTransaction
//            var extractDataJson = new JObject
//                {
//                    { "amount", request.Amount },
//                };
//            var extractData = Base64Encode(extractDataJson.ToString());
//            var reserveTablePaymentTransaction = new ReserveTablePaymentTransaction()
//            {
//                ReserveTableId = request.OrderId,
//                PaymentMethodId = (int)EnumPaymentMethod.MoMo,
//                TransId = 0,
//                Amount = Decimal.Parse(request.Amount),
//                ExtraData = extractData,
//                IsSuccess = false,
//                CreatedUser = accountId,
//                StoreId = storeId,
//            };
//            await _unitOfWork.ReserveTablePaymentTransactions.AddAsync(reserveTablePaymentTransaction);
//            //Handle Payment Request
//            var paymentRequest = new CreateGetwayRequestModel()
//            {
//                RequestId = reserveTablePaymentTransaction.Id.ToString(),
//                Amount = request.Amount,
//                OrderId = reserveTablePaymentTransaction.Id.ToString(),
//                OrderInfo = reserveTableInfo,
//                RedirectUrl = "fnb.gosell.vn", // redirect to weblink or applink after payment
//                IpnUrl = ipnUrl,
//                PartnerClientId = email,
//                ExtraData = extractData,
//                Language = request.Language
//            };
//            return paymentRequest;
//        }

//        private async Task<CreateGetwayRequestModel> CreateOrderPaymentTransactionAsync(
//            CreateMoMoPaymentRequest request,
//            Guid? accountId,
//            string storeName,
//            string branchName,
//            string ipnUrl,
//            string email,
//            bool? isPlatformPOS = false)
//        {
//            var orderInfo = $"Payment for order {request?.OrderCode} at {storeName} - {branchName}";
//            //Handle Create OrderPaymentTransaction
//            var extractDataJson = new JObject
//                {
//                    { "orderId", request.OrderId.ToString() },
//                    { "amount", request.Amount },
//                    { "isPlatformPOS", isPlatformPOS }
//                };
//            var extractData = Base64Encode(extractDataJson.ToString());
//            var orderPaymentTransaction = new OrderPaymentTransaction()
//            {
//                OrderId = request.OrderId,
//                PaymentMethodId = (int)EnumPaymentMethod.MoMo,
//                TransId = 0,
//                OrderInfo = orderInfo,
//                Amount = Decimal.Parse(request.Amount),
//                ExtraData = extractData,
//                IsSuccess = false,
//                CreatedUser = accountId
//            };
//            await _unitOfWork.OrderPaymentTransactions.AddAsync(orderPaymentTransaction);
//            //Handle Payment Request
//            var paymentRequest = new CreateGetwayRequestModel()
//            {
//                RequestId = orderPaymentTransaction.Id.ToString(),
//                Amount = request.Amount,
//                OrderId = orderPaymentTransaction.Id.ToString(),
//                OrderInfo = orderInfo,
//                RedirectUrl = "fnb.gosell.vn", // redirect to weblink or applink after payment
//                IpnUrl = ipnUrl,
//                PartnerClientId = email,
//                ExtraData = extractData,
//                Language = request.Language
//            };
//            return paymentRequest;
//        }

//        public static string Base64Encode(string plainText)
//        {
//            var plainTextBytes = System.Text.Encoding.UTF8.GetBytes(plainText);
//            return System.Convert.ToBase64String(plainTextBytes);
//        }
//    }
//}
