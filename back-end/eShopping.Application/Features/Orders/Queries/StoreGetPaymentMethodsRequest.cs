using AutoMapper;
using eShopping.Common.Constants;
using eShopping.Interfaces;
using eShopping.Models.Orders;
using MediatR;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace eShopping.Application.Features.Orders.Queries
{
    public class StoreGetPaymentMethodsRequest : IRequest<IEnumerable<StorePaymentMethod>>
    {
    }

    public class StoreGetPaymentMethodsRequestHandler : IRequestHandler<StoreGetPaymentMethodsRequest, IEnumerable<StorePaymentMethod>>
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

        public async Task<IEnumerable<StorePaymentMethod>> Handle(StoreGetPaymentMethodsRequest request, CancellationToken cancellationToken)
        {
            var response = DefaultConstants.ALLOW_PAYMENT_METHOD.Select(method => new StorePaymentMethod { Id = method });
            return response;
        }
    }
}
