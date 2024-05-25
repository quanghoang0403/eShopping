using AutoMapper;
using AutoMapper.QueryableExtensions;
using eShopping.Common.Models;
using eShopping.Interfaces;
using eShopping.Models.Orders;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace eShopping.Application.Features.Orders.Queries
{
    public class StoreGetOrderByIdRequest : IRequest<BaseResponseModel>
    {
        public Guid Id { get; set; }
    }

    public class StoreGetOrderByIdRequestHandler : IRequestHandler<StoreGetOrderByIdRequest, BaseResponseModel>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IUserProvider _userProvider;
        private readonly IMapper _mapper;
        private readonly MapperConfiguration _mapperConfiguration;

        public StoreGetOrderByIdRequestHandler(
            IUnitOfWork unitOfWork,
            IUserProvider userProvider,
            IMapper mapper,
            MapperConfiguration mapperConfiguration
            )
        {
            _unitOfWork = unitOfWork;
            _userProvider = userProvider;
            _mapper = mapper;
            _mapperConfiguration = mapperConfiguration;
        }

        public async Task<BaseResponseModel> Handle(StoreGetOrderByIdRequest request, CancellationToken cancellationToken)
        {
            var loggedUser = await _userProvider.ProvideAsync(cancellationToken);

            if (request == null || request.Id.Equals(Guid.Empty))
            {
                return BaseResponseModel.ReturnError("No request is match");

            }

            var order = await _unitOfWork.Orders.Where(o => o.Id == request.Id)
                                                .Include(o => o.Customer)
                                                .Include(o => o.Customer).ThenInclude(c => c.District)
                                                .Include(o => o.Customer).ThenInclude(c => c.Ward)
                                                .Include(o => o.Customer).ThenInclude(c => c.City)
                                                .Include(o => o.OrderItems)
                                                .AsNoTracking()
                                                .ProjectTo<StoreOrderDetailModel>(_mapperConfiguration)
                                                .FirstOrDefaultAsync(cancellationToken: cancellationToken);

            if (order == null)
            {
                return BaseResponseModel.ReturnError("Not found order");
            }

            order.Reason = await _unitOfWork.OrderHistories
                .Where(oh => oh.OrderId == order.Id && oh.CancelReason != null)
                .OrderByDescending(oh => oh.CreatedTime)
                .AsNoTracking()
                .Select(oh => oh.CancelReason)
                .FirstOrDefaultAsync(cancellationToken: cancellationToken);

            return BaseResponseModel.ReturnData(order);
        }
    }
}
