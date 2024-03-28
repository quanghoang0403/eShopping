﻿using AutoMapper;
using eShopping.Common.Extensions;
using eShopping.Common.Helpers;
using eShopping.Interfaces;
using eShopping.Models.Orders;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace GoFoodBeverage.Application.Features.Orders.Queries
{
    public class StoreGetOrdersRequest : IRequest<StoreGetOrdersResponse>
    {
        public DateTime StartDate { get; set; }

        public DateTime EndDate { get; set; }

        public int PageNumber { get; set; }

        public int PageSize { get; set; }

        public string KeySearch { get; set; }
    }

    public class StoreGetOrdersResponse
    {
        public IEnumerable<StoreOrderModel> Orders { get; set; }

        public int PageSize { get; set; }

        public int Total { get; set; }
    }

    public class StoreGetOrdersRequestHandler : IRequestHandler<StoreGetOrdersRequest, StoreGetOrdersResponse>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IUserProvider _userProvider;
        private readonly IMapper _mapper;

        public StoreGetOrdersRequestHandler(
            IUnitOfWork unitOfWork,
            IUserProvider userProvider,
            IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _userProvider = userProvider;
            _mapper = mapper;
        }

        public async Task<StoreGetOrdersResponse> Handle(StoreGetOrdersRequest request, CancellationToken cancellationToken)
        {
            var loggedUser = await _userProvider.ProvideAsync(cancellationToken);
            DateTime startDate = DatetimeHelpers.GetStartOfDay(request.StartDate);
            DateTime endDate = DatetimeHelpers.GetStartOfDay(request.EndDate);

            var listOrderCurrent = _unitOfWork.Orders.GetAll().AsNoTracking().Where(o => o.CustomerId == loggedUser.Id.Value && o.CreatedTime >= startDate && o.CreatedTime <= endDate);
            string keySearch = request?.KeySearch?.Trim().ToLower();

            if (!string.IsNullOrEmpty(keySearch))
            {
                if (int.TryParse(keySearch, out _))
                {
                    listOrderCurrent = listOrderCurrent
                        .Where(o => o.Code.ToString().Contains(keySearch));
                }
            }
            var listOrderOrdered = listOrderCurrent.OrderByDescending(o => o.CreatedTime);
            int pageNumber = request.PageNumber > 0 ? request.PageNumber : 1;
            int pageSize = request.PageSize > 0 ? request.PageSize : 10;
            var listOrderByPaging = await listOrderOrdered.ToPaginationAsync(pageNumber, pageSize);
            var listOrderModels = _mapper.Map<IEnumerable<StoreOrderModel>>(listOrderByPaging.Result);
            var response = new StoreGetOrdersResponse()
            {
                Orders = listOrderModels,
                Total = listOrderByPaging.Total,
                PageSize = pageSize
            };
            return response;
        }
    }
}