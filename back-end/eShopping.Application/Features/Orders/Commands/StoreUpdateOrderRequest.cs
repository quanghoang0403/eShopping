using AutoMapper;
using eShopping.Common.Exceptions;
using eShopping.Common.Extensions;
using eShopping.Interfaces;
using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace GoFoodBeverage.Application.Features.Orders.Commands
{
    public class StoreUpdateOrderRequest : IRequest<bool>
    {
        public Guid OrderId { get; set; }

        public string ShipName { set; get; }

        public string ShipAddress { get; set; }

        public string ShipEmail { set; get; }

        public string ShipPhoneNumber { set; get; }

        public string Note { get; set; }

        public int? ShipCityId { get; set; }

        public int? ShipDistrictId { get; set; }

        public int? ShipWardId { get; set; }
    }

    public class StoreUpdateOrderRequestHandle : IRequestHandler<StoreUpdateOrderRequest, bool>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IUserProvider _userProvider;
        private readonly IMapper _mapper;

        public StoreUpdateOrderRequestHandle(IUnitOfWork unitOfWork, IUserProvider userProvider, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _userProvider = userProvider;
            _mapper = mapper;
        }

        public async Task<bool> Handle(StoreUpdateOrderRequest request, CancellationToken cancellationToken)
        {
            var loggedUser = await _userProvider.ProvideAsync(cancellationToken);
            RequestValidation(request);
            var accountId = loggedUser.AccountId.Value;

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

            var order = await _unitOfWork.Orders.GetOrderItemByOrderIdAsync(request.OrderId);
            order.ShipName = request.ShipName;
            order.ShipEmail = request.ShipEmail;
            order.ShipPhoneNumber = request.ShipPhoneNumber;
            order.ShipAddress = request.ShipAddress;
            order.ShipFullAddress = request.ShipAddress + ward + district + city;
            order.ShipCityId = request.ShipCityId;
            order.ShipDistrictId = request.ShipDistrictId;
            order.ShipWardId = request.ShipWardId;
            order.ShipFullAddress = request.ShipAddress + ward + district + city;
            order.Note = request.Note;
            order.LastSavedTime = DateTime.UtcNow;
            order.LastSavedUser = accountId;
            return true;
        }

        private static void RequestValidation(StoreUpdateOrderRequest request)
        {
            ThrowError.Against(string.IsNullOrEmpty(request.ShipName), "Please enter product ship name");
            ThrowError.Against(string.IsNullOrEmpty(request.ShipAddress), "Please enter product ship address");
            ThrowError.Against(string.IsNullOrEmpty(request.ShipPhoneNumber), "Please enter product ship phone");
        }
    }
}
