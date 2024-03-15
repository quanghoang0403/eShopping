using AutoMapper;
using AutoMapper.QueryableExtensions;
using eShopping.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace GoFoodBeverage.Application.Features.Orders.Queries
{
    public class AdminGetOrderByIdRequest : IRequest<AdminGetOrderByIdResponse>
    {
        public Guid Id { get; set; }
    }

    public class AdminGetOrderByIdResponse
    {
        public OrderDetailDataById Order { get; set; }
    }

    public class AdminGetOrderByIdRequestHandler : IRequestHandler<AdminGetOrderByIdRequest, AdminGetOrderByIdResponse>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IUserProvider _userProvider;
        private readonly IMapper _mapper;
        private readonly MapperConfiguration _mapperConfiguration;

        public AdminGetOrderByIdRequestHandler(
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

        public async Task<AdminGetOrderByIdResponse> Handle(AdminGetOrderByIdRequest request, CancellationToken cancellationToken)
        {
            var loggedUser = await _userProvider.ProvideAsync(cancellationToken);

            if (request == null || request.Id.Equals(Guid.Empty))
            {
                return null;
            }

            var order = await _unitOfWork.Orders.GetOrderDetailDataById(request.Id, loggedUser.StoreId)
                              .AsNoTracking()
                              .ProjectTo<OrderDetailDataById>(_mapperConfiguration)
                              .FirstOrDefaultAsync(cancellationToken: cancellationToken);

            order.OrderItems = order.OrderItems.Where(oi => oi.StatusId != Domain.Enums.EnumOrderItemStatus.Canceled);

            if (order == null)
            {
                return null;
            }

            if (order.BranchId != null)
            {
                order.BranchName = await _unitOfWork.StoreBranches
                    .GetStoreBranchByIdAsync(order.BranchId)
                    .AsNoTracking()
                    .Select(b => b.Name)
                    .FirstOrDefaultAsync(cancellationToken: cancellationToken);
            }

            //If there is no customer profile. Do not query table CustomerMembershipLevel
            if (order.CustomerId != null)
            {
                //Only select max membership base on AccumulatedPoint <= order.Customer.AccumulatedPoint. Get max item
                string membership = await _unitOfWork.CustomerMemberships
                    .GetAllCustomerMembershipInStore(loggedUser.StoreId)
                    .Where(cm => cm.AccumulatedPoint <= order.Customer.AccumulatedPoint)
                    .OrderByDescending(x => x.AccumulatedPoint)
                    .AsNoTracking()
                    .Select(m => m.Name)
                    .FirstOrDefaultAsync(cancellationToken: cancellationToken);

                if (!string.IsNullOrWhiteSpace(membership))
                {
                    order.Customer.Rank = membership;
                }
            }

            order.Reason = await _unitOfWork.OrderHistories
                .Where(oh => oh.OrderId == order.Id && oh.StoreId == loggedUser.StoreId && oh.CancelReason != null)
                .OrderByDescending(oh => oh.CreatedTime)
                .AsNoTracking()
                .Select(oh => oh.CancelReason)
                .FirstOrDefaultAsync(cancellationToken: cancellationToken);

            var response = new AdminGetOrderByIdResponse()
            {
                Order = order
            };

            return response;
        }
    }
}
