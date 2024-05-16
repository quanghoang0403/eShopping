using AutoMapper;
using eShopping.Common.Extensions;
using eShopping.Common.Helpers;
using eShopping.Domain.Enums;
using eShopping.Interfaces;
using eShopping.Models.Orders;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace eShopping.Application.Features.Orders.Queries
{
    public class AdminGetOrdersRequest : IRequest<AdminGetOrdersResponse>
    {
        public DateTime StartDate { get; set; }

        public DateTime EndDate { get; set; }

        public EnumOptionDate OptionDate { get; set; }

        public int PageNumber { get; set; }

        public int PageSize { get; set; }

        public string KeySearch { get; set; }
    }

    public class AdminGetOrdersResponse
    {
        public IEnumerable<AdminOrderModel> Orders { get; set; }

        public int PageSize { get; set; }

        public int Total { get; set; }
    }

    public class AdminGetOrdersRequestHandler : IRequestHandler<AdminGetOrdersRequest, AdminGetOrdersResponse>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IUserProvider _userProvider;
        private readonly IMapper _mapper;

        public AdminGetOrdersRequestHandler(
            IUnitOfWork unitOfWork,
            IUserProvider userProvider,
            IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _userProvider = userProvider;
            _mapper = mapper;
        }

        public async Task<AdminGetOrdersResponse> Handle(AdminGetOrdersRequest request, CancellationToken cancellationToken)
        {
            var loggedUser = await _userProvider.ProvideAsync(cancellationToken);
            DateTime startDate = DatetimeHelpers.GetStartOfDay(request.StartDate);
            DateTime endDate = DatetimeHelpers.GetStartOfDay(request.EndDate);

            var listAllOrder = _unitOfWork.Orders.GetAll().AsNoTracking();

            string keySearch = request?.KeySearch?.Trim().ToLower();

            if (!string.IsNullOrEmpty(keySearch))
            {
                if (int.TryParse(keySearch, out _))
                {
                    listAllOrder = listAllOrder
                        .Where(o => o.Code.ToString().Contains(keySearch));
                }
            }
            var listOrderOrdered = listAllOrder.OrderByDescending(o => o.CreatedTime);
            int pageNumber = request.PageNumber > 0 ? request.PageNumber : 1;
            int pageSize = request.PageSize > 0 ? request.PageSize : 20;
            var listOrderByPaging = await listOrderOrdered.Include(o => o.OrderItems).ToPaginationAsync(pageNumber, pageSize);
            var listOrderModels = _mapper.Map<IEnumerable<AdminOrderModel>>(listOrderByPaging.Result);

            var response = new AdminGetOrdersResponse()
            {
                Orders = listOrderModels,
                Total = listOrderByPaging.Total,
                PageSize = pageSize
            };
            return response;
        }
    }
}
