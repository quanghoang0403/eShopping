using AutoMapper;
using eShopping.Common.Constants;
using eShopping.Common.Exceptions;
using eShopping.Common.Extensions;
using eShopping.Domain.Entities;
using eShopping.Domain.Enums;
using eShopping.Interfaces;
using eShopping.Models.Products;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace GoFoodBeverage.Application.Features.Orders.Commands
{
    public class StoreCreateOrderRequest : IRequest<StoreCreateOrderResponse>
    {
        public IEnumerable<StoreCartModel> CartItem { get; set; }

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
    }

    public class StoreCreateOrderRequestHandle : IRequestHandler<StoreCreateOrderRequest, StoreCreateOrderResponse>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IUserProvider _userProvider;
        private readonly IMapper _mapper;

        public StoreCreateOrderRequestHandle(IUnitOfWork unitOfWork, IUserProvider userProvider, IMapper mapper)
        {
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
                                                .AsNoTracking()
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
                    ShipName = request.ShipName,
                    ShipEmail = request.ShipEmail,
                    ShipPhoneNumber = request.ShipPhoneNumber,
                    ShipFullAddress = request.ShipAddress + ward + district + city,
                    Note = request.Note,
                    CreatedTime = DateTime.Now,
                    CreatedUser = accountId,
                });

                // Add order detail
                var orderItems = new List<OrderItem>();
                foreach (var item in request.CartItem)
                {
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

                await createTransaction.CommitAsync(cancellationToken);

                return new StoreCreateOrderResponse()
                {
                    IsSuccess = true,
                    OrderId = order.Id
                };
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
