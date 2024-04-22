using AutoMapper;
using eShopping.Application.Features.Payments.Commands;
using eShopping.Common.Constants;
using eShopping.Common.Exceptions;
using eShopping.Common.Extensions;
using eShopping.Domain.Entities;
using eShopping.Domain.Enums;
using eShopping.Interfaces;
using eShopping.Models.Products;
using eShopping.Payment.VNPay.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace eShopping.Application.Features.Orders.Commands
{
    public class StoreCreateOrderRequest : IRequest<StoreCreateOrderResponse>
    {
        public IEnumerable<StoreCartModel> CartItem { get; set; }

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
        public IEnumerable<StoreProductPriceModel> OrderItem { get; set; }

        public bool IsSuccess { get; set; }

        public Guid? OrderId { get; set; }

        public EnumPaymentMethod PaymentMethod { get; set; }

        /// <summary>
        /// Dynamic response payment info data
        /// </summary>
        public object PaymentInfo { get; set; }
    }

    public class StoreCreateOrderRequestHandle : IRequestHandler<StoreCreateOrderRequest, StoreCreateOrderResponse>
    {
        private readonly IMediator _mediator;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IUserProvider _userProvider;
        private readonly IMapper _mapper;

        public StoreCreateOrderRequestHandle(IMediator mediator, IUnitOfWork unitOfWork, IUserProvider userProvider, IMapper mapper)
        {
            _mediator = mediator;
            _unitOfWork = unitOfWork;
            _userProvider = userProvider;
            _mapper = mapper;
        }

        public async Task<StoreCreateOrderResponse> Handle(StoreCreateOrderRequest request, CancellationToken cancellationToken)
        {
            var loggedUser = await _userProvider.ProvideAsync(cancellationToken);
            RequestValidation(request);
            var accountId = loggedUser.AccountId.Value;
            var customerId = loggedUser.Id.Value;
            var prices = await _unitOfWork.ProductPrices.Where(x => request.CartItem.Any(cart => cart.ProductPriceId == x.Id)).Include(x => x.Product)
                                                .ToListAsync();
            var cartItemRes = _mapper.Map<List<StoreProductPriceModel>>(prices); ;
            if (prices.Count() != request.CartItem.Count())
            {
                return new StoreCreateOrderResponse()
                {
                    IsSuccess = false,
                    OrderItem = cartItemRes
                };
            }
            else
            {
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
                using var createTransaction = await _unitOfWork.BeginTransactionAsync();

                // Add order
                var order = await _unitOfWork.Orders.AddAsync(new Order()
                {
                    CustomerId = customerId,
                    Status = EnumOrderStatus.New,
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
                });

                var orderItems = new List<OrderItem>();
                foreach (var item in request.CartItem)
                {
                    // Add order detail
                    var price = prices.FirstOrDefault(p => p.Id == item.ProductPriceId);
                    if (price == null ||
                        price.QuantityLeft < item.Quantity ||
                        price.PriceDiscount != item.PriceDiscount ||
                        price.PriceValue != item.PriceValue ||
                        price.PercentNumber != item.PercentNumber)
                    {
                        await createTransaction.RollbackAsync(cancellationToken);
                        return new StoreCreateOrderResponse()
                        {
                            IsSuccess = false,
                            OrderItem = cartItemRes
                        };
                    }
                    else
                    {
                        orderItems.Add(new OrderItem()
                        {
                            OrderId = order.Id,
                            ProductId = item.ProductId,
                            ProductName = item.ProductName,
                            ProductUrl = price.Product.UrlSEO,
                            ProductPriceId = item.ProductPriceId,
                            PercentNumber = item.PercentNumber,
                            PriceName = price.PriceName,
                            PriceOrigin = price.PriceOriginal,
                            PriceDiscount = price.PriceDiscount,
                            PriceValue = price.PriceValue,
                            Quantity = item.Quantity,
                            Thumbnail = item.Thumbnail,
                            CreatedTime = DateTime.Now,
                            CreatedUser = accountId,
                        });
                    }

                    // Update quantity
                    price.QuantityLeft -= item.Quantity;
                    price.QuantitySold += item.Quantity;
                }

                // Add order history
                var orderHistory = await _unitOfWork.OrderHistories.AddAsync(new OrderHistory()
                {
                    OrderId = order.Id,
                    ActionType = EnumOrderActionType.CREATE_ORDER,
                    Note = request.Note,
                    CreatedTime = DateTime.Now,
                    CreatedUser = accountId,
                });

                var res = new StoreCreateOrderResponse()
                {
                    IsSuccess = true,
                    OrderId = order.Id
                };

                /// Create payment
                var isValidMethod = DefaultConstants.ALLOW_PAYMENT_METHOD.Any(method => method == request.PaymentMethodId);
                ThrowError.Against(isValidMethod, "Invalid payment method, please choose another method");

                switch (order.PaymentMethodId)
                {
                    case EnumPaymentMethod.COD:
                        var orderPaymentTransaction = new OrderPaymentTransaction()
                        {
                            IsSuccess = true,
                            OrderId = order.Id,
                            OrderInfo = "Ship COD",
                            Amount = order.TotalAmount,
                            PaymentMethodId = EnumPaymentMethod.BankTransferVietQR,
                            CreatedUser = loggedUser.AccountId.Value,
                            CreatedTime = DateTime.UtcNow,
                        };
                        await _unitOfWork.OrderPaymentTransactions.AddAsync(orderPaymentTransaction);
                        break;
                    case EnumPaymentMethod.MoMo:
                        //var createMoMoQrPayment = new CreateMoMoPaymentRequest()
                        //{
                        //    OrderId = storeWebCreateOrderResponse.OrderId,
                        //    OrderCode = storeWebCreateOrderResponse.OrderCode,
                        //    Amount = Convert.ToInt32(order.TotalAmount).ToString(),
                        //    StoreId = loggedUser.StoreId,
                        //    BranchId = request.BranchId,
                        //    AccountId = request.AccountId,
                        //    Platform = EnumPlatform.StoreWebsite /// Store web request
                        //};
                        //var paymentInfo = await _mediator.Send(createMoMoQrPayment, cancellationToken);
                        //storeWebCreateOrderResponse.PaymentInfo = paymentInfo;
                        break;
                    case EnumPaymentMethod.ZaloPay:
                        // TO DO
                        break;
                    case EnumPaymentMethod.ShopeePay:
                        // TO DO
                        break;
                    case EnumPaymentMethod.BankTransferVietQR:
                        var createVietQR = new CreateVietQRPaymentRequest()
                        {
                            OrderId = order.Id,
                            Amount = order.TotalAmount,
                            Description = $"{order.ShipName} {order.Id}"
                        };
                        res.PaymentInfo = await _mediator.Send(createVietQR, cancellationToken);
                        break;
                    case EnumPaymentMethod.VNPayQR:
                        var createVnPay = new CreateVNPayPaymentRequest()
                        {
                            VNPayBankCode = VNPayBankCode.VNPAYQR,
                            OrderId = order.Id,
                            Amount = order.TotalAmount
                        };
                        res.PaymentInfo = await _mediator.Send(createVnPay, cancellationToken);
                        break;
                    case EnumPaymentMethod.PayOS:
                        // TO DO
                        break;
                    case EnumPaymentMethod.ATM:
                        var createATM = new CreateVNPayPaymentRequest()
                        {
                            VNPayBankCode = VNPayBankCode.VNBANK,
                            OrderId = order.Id,
                            Amount = order.TotalAmount
                        };
                        res.PaymentInfo = await _mediator.Send(createATM, cancellationToken);
                        break;
                    case EnumPaymentMethod.CreditDebitCard:
                        var createCredit = new CreateVNPayPaymentRequest()
                        {
                            VNPayBankCode = VNPayBankCode.INTCARD,
                            OrderId = order.Id,
                            Amount = order.TotalAmount
                        };
                        res.PaymentInfo = await _mediator.Send(createCredit, cancellationToken);
                        break;
                }

                await _unitOfWork.SaveChangesAsync();
                await createTransaction.CommitAsync(cancellationToken);

                return res;
            }
        }

        private static void RequestValidation(StoreCreateOrderRequest request)
        {
            ThrowError.Against(string.IsNullOrEmpty(request.ShipName), "Please enter product ship name");
            ThrowError.Against(string.IsNullOrEmpty(request.ShipAddress), "Please enter product ship address");
            ThrowError.Against(string.IsNullOrEmpty(request.ShipPhoneNumber), "Please enter product ship phone");
            ThrowError.Against(request.CartItem == null || !request.CartItem.Any(), "Can not find product");
            ThrowError.Against(request.CartItem.Any(cart => cart.Quantity <= 0 || cart.ProductPriceId == Guid.Empty), "Can not find product");
        }
    }
}
