﻿using AutoMapper;
using AutoMapper.QueryableExtensions;
using eShopping.Common.Exceptions;
using eShopping.Interfaces;
using eShopping.Models.Orders;
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
        public AdminOrderDetailModel Order { get; set; }
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
                ThrowError.Against(request == null || request.Id.Equals(Guid.Empty), "Not find request");
            }

            var order = await _unitOfWork.Orders.Where(o => o.Id == request.Id)
                                                .Include(o => o.Customer)
                                                .Include(o => o.Customer).ThenInclude(c => c.District)
                                                .Include(o => o.Customer).ThenInclude(c => c.Ward)
                                                .Include(o => o.Customer).ThenInclude(c => c.City)
                                                .Include(o => o.OrderItems)
                                                .Include(o => o.OrderItems).ThenInclude(oi => oi.ProductPrice)
                                                .Include(o => o.OrderItems).ThenInclude(oi => oi.ProductPrice).ThenInclude(p => p.Product)
                                                .AsNoTracking()
                                                .ProjectTo<AdminOrderDetailModel>(_mapperConfiguration)
                                                .FirstOrDefaultAsync(cancellationToken: cancellationToken);

            if (order == null)
            {
                ThrowError.Against(request == null || request.Id.Equals(Guid.Empty), "Not found order");
            }

            order.Reason = await _unitOfWork.OrderHistories
                .Where(oh => oh.OrderId == order.Id && oh.CancelReason != null)
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