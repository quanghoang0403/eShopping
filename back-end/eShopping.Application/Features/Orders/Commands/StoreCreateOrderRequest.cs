using eShopping.Interfaces;
using eShopping.Models.Products;
using MediatR;
using System.Collections.Generic;
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
    }

    public class StoreCreateOrderRequestHandle : IRequestHandler<StoreCreateOrderRequest, StoreCreateOrderResponse>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IUserProvider _userProvider;

        public StoreCreateOrderRequestHandle(IUnitOfWork unitOfWork, IUserProvider userProvider)
        {
            _unitOfWork = unitOfWork;
            _userProvider = userProvider;
        }

        public async Task<StoreCreateOrderResponse> Handle(StoreCreateOrderRequest request, CancellationToken cancellationToken)
        {
            var loggedUser = await _userProvider.ProvideAsync(cancellationToken);

            return new StoreCreateOrderResponse()
            {
                IsSuccess = true,
            };
        }
    }
}
