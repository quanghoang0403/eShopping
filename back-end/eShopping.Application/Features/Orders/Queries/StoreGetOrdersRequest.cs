using AutoMapper;
using eShopping.Common.Extensions;
using eShopping.Common.Helpers;
using eShopping.Common.Models;
using eShopping.Interfaces;
using eShopping.Models.Orders;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using static eShopping.Common.Extensions.PagingExtensions;

namespace eShopping.Application.Features.Orders.Queries
{
    public class StoreGetOrdersRequest : IRequest<BaseResponseModel>
    {
        public DateTime? StartDate { get; set; }

        public DateTime? EndDate { get; set; }

        public int PageNumber { get; set; }

        public int PageSize { get; set; }

        public string KeySearch { get; set; }
    }

    public class StoreGetOrdersRequestHandler : IRequestHandler<StoreGetOrdersRequest, BaseResponseModel>
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

        public async Task<BaseResponseModel> Handle(StoreGetOrdersRequest request, CancellationToken cancellationToken)
        {
            var loggedUser = await _userProvider.ProvideAsync(cancellationToken);

            var listOrderCurrent = _unitOfWork.Orders.GetAll().AsNoTracking().Where(o => o.CustomerId == loggedUser.Id.Value);
            string keySearch = request?.KeySearch?.Trim().ToLower();
            if (request.StartDate != null)
            {
                DateTime startDate = DatetimeHelpers.GetStartOfDay((DateTime)request.StartDate);
                listOrderCurrent = listOrderCurrent.Where(o => o.CreatedTime >= startDate);
            }
            if (request.EndDate != null)
            {
                DateTime endDate = DatetimeHelpers.GetStartOfDay((DateTime)request.EndDate);
                listOrderCurrent = listOrderCurrent.Where(o => o.CreatedTime < endDate);
            }
            if (!string.IsNullOrEmpty(keySearch))
            {
                if (int.TryParse(keySearch, out _))
                {
                    listOrderCurrent = listOrderCurrent.Where(o => o.Code.ToString().Contains(keySearch));
                }
            }
            var listOrderOrdered = listOrderCurrent.OrderByDescending(o => o.CreatedTime);
            int pageNumber = request.PageNumber > 0 ? request.PageNumber : 1;
            int pageSize = request.PageSize > 0 ? request.PageSize : 10;
            var listOrderByPaging = await listOrderOrdered.Include(o => o.OrderItems).ToPaginationAsync(pageNumber, pageSize);
            var listOrderModels = _mapper.Map<List<StoreOrderModel>>(listOrderByPaging.Result);
            var response = new PagingResult<StoreOrderModel>(listOrderModels, listOrderByPaging.Paging);
            return BaseResponseModel.ReturnData(response);

        }
    }
}
