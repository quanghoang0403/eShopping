using AutoMapper;
using eShopping.Common.Constants;
using eShopping.Common.Models;
using eShopping.Interfaces;
using eShopping.Models.Orders;
using MediatR;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace eShopping.Application.Features.Orders.Queries
{
    public class StoreGetPaymentMethodsRequest : IRequest<BaseResponseModel>
    {
    }

    public class StoreGetPaymentMethodsRequestHandler : IRequestHandler<StoreGetPaymentMethodsRequest, BaseResponseModel>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IUserProvider _userProvider;
        private readonly IMapper _mapper;

        public StoreGetPaymentMethodsRequestHandler(
            IUnitOfWork unitOfWork,
            IUserProvider userProvider,
            IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _userProvider = userProvider;
            _mapper = mapper;
        }

        public async Task<BaseResponseModel> Handle(StoreGetPaymentMethodsRequest request, CancellationToken cancellationToken)
        {
            var response = DefaultConstants.ALLOW_PAYMENT_METHOD.Select(method => new StorePaymentMethod { Id = method });
            return BaseResponseModel.ReturnData(response);
        }
    }
}
