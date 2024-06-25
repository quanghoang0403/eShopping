using AutoMapper;
using eShopping.Application.Features.Payments.Commands;
using eShopping.Common.Constants;
using eShopping.Common.Extensions;
using eShopping.Common.Models;
using eShopping.Domain.Entities;
using eShopping.Domain.Enums;
using eShopping.Interfaces;
using eShopping.Models.Products;
using eShopping.Payment.VNPay.Enums;
using eShopping.Services.Hubs;
using MediatR;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace eShopping.Application.Features.Orders.Commands
{
    public class StoreCreateOrderRequest : IRequest<BaseResponseModel>
    {
        public IEnumerable<StoreCartModel> CartItems { get; set; }

        public EnumPaymentMethod PaymentMethodId { get; set; }

        public string ShipName { set; get; }

        public string ShipAddress { get; set; }

        public string ShipEmail { set; get; }

        public string ShipPhoneNumber { set; get; }

        public string Note { get; set; }

        public int? ShipCityId { get; set; }

        public int? ShipDistrictId { get; set; }

        public int? ShipWardId { get; set; }
    }

    public class StoreCreateOrderResponse
    {
        // If out of stock, response this data to user limit quantity
        public IEnumerable<StoreCartModel> CartItems { get; set; }

        public bool IsSuccess { get; set; }

        public Guid? OrderId { get; set; }

        public int? OrderCode { get; set; }

        public EnumPaymentMethod PaymentMethodId { get; set; }

        /// <summary>
        /// Dynamic response payment info data
        /// </summary>
        public object PaymentInfo { get; set; }
    }

    public class StoreCreateOrderRequestHandle : IRequestHandler<StoreCreateOrderRequest, BaseResponseModel>
    {
        private readonly IMediator _mediator;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IUserProvider _userProvider;
        private readonly IMapper _mapper;
        private readonly IHubContext<OrderHub> _hubContext;

        public StoreCreateOrderRequestHandle(IMediator mediator, IUnitOfWork unitOfWork, IUserProvider userProvider, IMapper mapper, IHubContext<OrderHub> hubContext)
        {
            _mediator = mediator;
            _unitOfWork = unitOfWork;
            _userProvider = userProvider;
            _mapper = mapper;
            _hubContext = hubContext;
        }

        public async Task<BaseResponseModel> Handle(StoreCreateOrderRequest request, CancellationToken cancellationToken)
        {
            var loggedUser = await _userProvider.ProvideAsync(cancellationToken);
            if (RequestValidation(request) != null)
            {
                return RequestValidation(request);
            }
            var accountId = loggedUser.AccountId.Value;
            var customerId = loggedUser.Id.Value;


            // Handle address
            var city = string.Empty;
            var district = string.Empty;
            var ward = string.Empty;
            if (request.ShipCityId != null && request.ShipCityId > 0)
            {
                var cityData = await _unitOfWork.Cities.GetByIdAsync((int)request.ShipCityId);
                if (cityData != null)
                {
                    city = cityData.Name.FormatAddress();
                }
            }
            if (request.ShipDistrictId != null && request.ShipDistrictId > 0)
            {
                var districtData = await _unitOfWork.Districts.GetByIdAsync((int)request.ShipDistrictId);
                if (districtData != null)
                {
                    district = districtData.Name.FormatAddress();
                }
            }
            if (request.ShipWardId != null && request.ShipWardId > 0)
            {
                var wardData = await _unitOfWork.Wards.GetByIdAsync((int)request.ShipWardId);
                if (wardData != null)
                {
                    ward = wardData.Prefix.FormatAddress() + ' ' + wardData.Name;
                }
            }

            var isFailed = false;
            return await _unitOfWork.CreateExecutionStrategy().ExecuteAsync(async () =>
            {
                using var createTransaction = await _unitOfWork.BeginTransactionAsync();
                var orderItems = new List<OrderItem>();
                foreach (var item in request.CartItems)
                {
                    // Add order detail
                    var stock = await _unitOfWork.ProductStocks
                       .Where(x => x.ProductId == item.ProductId
                       && x.ProductVariantId == item.ProductVariantId
                       && x.ProductSizeId == item.ProductSizeId)
                       .FirstOrDefaultAsync();
                    var variant = await _unitOfWork.ProductVariants
                        .Where(x => x.Id == item.ProductVariantId)
                        .Include(x => x.Product)
                        .AsNoTracking()
                        .FirstOrDefaultAsync();
                    if (stock == null)
                    {
                        isFailed = true;
                        continue;
                    }
                    if (stock != null && stock.QuantityLeft < item.Quantity)
                    {
                        isFailed = true;
                        item.Quantity = stock.QuantityLeft;
                    }
                    if (variant.PriceDiscount != item.PriceDiscount
                    || variant.PriceValue != item.PriceValue
                    || variant.PercentNumber != item.PercentNumber)
                    {
                        isFailed = true;
                        item.PriceDiscount = variant.PriceDiscount;
                        item.PriceValue = variant.PriceValue;
                        item.PercentNumber = variant.PercentNumber;
                    }
                    if (isFailed) continue;

                    orderItems.Add(new OrderItem()
                    {
                        ProductId = item.ProductId,
                        ProductName = item.ProductName,
                        ProductUrl = variant.Product.UrlSEO,
                        ProductVariantId = item.ProductVariantId,
                        ProductSizeId = item.ProductSizeId,
                        PercentNumber = item.PercentNumber,
                        ProductVariantName = variant.Name,
                        ProductSizeName = item.ProductSizeName,
                        PriceOrigin = variant.PriceOriginal,
                        PriceDiscount = variant.PriceDiscount,
                        PriceValue = variant.PriceValue,
                        Quantity = item.Quantity,
                        Thumbnail = item.Thumbnail,
                        CreatedTime = DateTime.Now,
                        CreatedUser = accountId,
                    });
                    stock.QuantityLeft -= item.Quantity;
                }

                if (isFailed)
                {
                    return BaseResponseModel.ReturnData(new StoreCreateOrderResponse()
                    {
                        IsSuccess = false,
                        CartItems = request.CartItems
                    });
                }

                // Add order
                var order = await _unitOfWork.Orders.AddAsync(new Order()
                {
                    CustomerId = customerId,
                    Status = EnumOrderStatus.New,
                    OrderPaymentStatusId = EnumOrderPaymentStatus.Unpaid,
                    DeliveryFee = DefaultConstants.DELIVERY_FEE,
                    PaymentMethodId = request.PaymentMethodId,
                    ShipName = request.ShipName,
                    ShipEmail = request.ShipEmail,
                    ShipPhoneNumber = request.ShipPhoneNumber,
                    ShipAddress = request.ShipAddress,
                    ShipFullAddress = request.ShipAddress + ward + district + city,
                    ShipCityId = request.ShipCityId,
                    ShipDistrictId = request.ShipDistrictId,
                    ShipWardId = request.ShipWardId,
                    Note = request.Note,
                    CreatedTime = DateTime.Now,
                    CreatedUser = accountId,
                    OrderItems = orderItems,

                });
                var res = new StoreCreateOrderResponse()
                {
                    IsSuccess = true,
                    PaymentMethodId = request.PaymentMethodId,
                    OrderId = order.Id,
                    OrderCode = order.Code
                };
                // Add order history
                var orderHistory = await _unitOfWork.OrderHistories.AddAsync(new OrderHistory()
                {
                    OrderId = order.Id,
                    ActionType = EnumOrderActionType.CREATE_ORDER,
                    Note = request.Note,
                    CreatedTime = DateTime.Now,
                    CreatedUser = accountId,
                });
                /// Create payment
                var isValidMethod = DefaultConstants.ALLOW_PAYMENT_METHOD.Any(method => method == request.PaymentMethodId);
                if (!isValidMethod)
                {
                    BaseResponseModel.ReturnError("Invalid payment method, please choose another method");
                }
                var totalAmount = orderItems.Sum(x => x.TotalPrice) + order.DeliveryFee;
                switch (order.PaymentMethodId)
                {
                    case EnumPaymentMethod.COD:
                        var orderPaymentTransaction = new OrderPaymentTransaction()
                        {
                            IsSuccess = true,
                            OrderId = order.Id,
                            OrderInfo = "Ship COD",
                            Amount = totalAmount,
                            PaymentMethodId = EnumPaymentMethod.BankTransferVietQR,
                            CreatedUser = loggedUser.AccountId.Value,
                            CreatedTime = DateTime.Now,
                        };
                        await _unitOfWork.OrderPaymentTransactions.AddAsync(orderPaymentTransaction);
                        break;
                    case EnumPaymentMethod.MoMo:
                        var createMoMoQrPayment = new CreateMoMoPaymentRequest()
                        {
                            OrderId = order.Id,
                            OrderCode = order.Code,
                            Amount = Convert.ToInt32(totalAmount).ToString(),
                        };
                        res.PaymentInfo = await _mediator.Send(createMoMoQrPayment, cancellationToken);
                        break;
                    case EnumPaymentMethod.ZaloPay:
                        // TODO
                        break;
                    case EnumPaymentMethod.ShopeePay:
                        // TODO
                        break;
                    case EnumPaymentMethod.BankTransferVietQR:
                        var createVietQR = new CreateVietQRPaymentRequest()
                        {
                            OrderId = order.Id,
                            Amount = totalAmount,
                            Description = $"{order.ShipName} {order.Id}"
                        };
                        res.PaymentInfo = await _mediator.Send(createVietQR, cancellationToken);
                        break;
                    case EnumPaymentMethod.VNPayQR:
                        var createVnPay = new CreateVNPayPaymentRequest()
                        {
                            VNPayBankCode = VNPayBankCode.VNPAYQR,
                            OrderId = order.Id,
                            OrderCode = order.Code,
                            Amount = totalAmount,
                            PaymentMethodId = order.PaymentMethodId
                        };
                        res.PaymentInfo = await _mediator.Send(createVnPay, cancellationToken);
                        break;
                    case EnumPaymentMethod.PayOS:
                        var createPayOS = new CreatePayOSPaymentRequest()
                        {
                            OrderId = order.Id,
                            Amount = Convert.ToInt32(totalAmount),
                            OrderCode = order.Code,
                            OrderItems = orderItems,
                        };
                        res.PaymentInfo = await _mediator.Send(createPayOS, cancellationToken);
                        break;
                    case EnumPaymentMethod.ATM:
                        var createATM = new CreateVNPayPaymentRequest()
                        {
                            VNPayBankCode = VNPayBankCode.VNBANK,
                            OrderId = order.Id,
                            OrderCode = order.Code,
                            Amount = totalAmount,
                            PaymentMethodId = order.PaymentMethodId
                        };
                        res.PaymentInfo = await _mediator.Send(createATM, cancellationToken);
                        break;
                    case EnumPaymentMethod.CreditDebitCard:
                        var createCredit = new CreateVNPayPaymentRequest()
                        {
                            VNPayBankCode = VNPayBankCode.INTCARD,
                            OrderId = order.Id,
                            OrderCode = order.Code,
                            Amount = totalAmount,
                            PaymentMethodId = order.PaymentMethodId
                        };
                        res.PaymentInfo = await _mediator.Send(createCredit, cancellationToken);
                        break;
                }

                await _unitOfWork.SaveChangesAsync();
                await createTransaction.CommitAsync(cancellationToken);
                await _hubContext.Clients.All.SendAsync(OrderHubConstants.CREATE_ORDER_BY_CUSTOMER, res, cancellationToken);
                return BaseResponseModel.ReturnData(res);
            });

        }

        private static BaseResponseModel RequestValidation(StoreCreateOrderRequest request)
        {
            if (string.IsNullOrEmpty(request.ShipName))
            {
                return BaseResponseModel.ReturnError("Please enter product ship address");
            }
            if (string.IsNullOrEmpty(request.ShipAddress))
            {
                return BaseResponseModel.ReturnError("Please enter product ship name");
            }
            if (string.IsNullOrEmpty(request.ShipAddress))
            {
                return BaseResponseModel.ReturnError("Please enter product ship address");
            }
            if (string.IsNullOrEmpty(request.ShipPhoneNumber))
            {
                return BaseResponseModel.ReturnError("Please enter product ship phone");
            }
            if (request.CartItems == null || !request.CartItems.Any())
            {
                return BaseResponseModel.ReturnError("Can not find product");
            }
            if (request.CartItems.Any(cart => cart.Quantity <= 0 || cart.ProductVariantId == Guid.Empty))
            {
                return BaseResponseModel.ReturnError("Can not find product");
            }
            return null;
        }
    }
}
