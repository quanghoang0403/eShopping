using MediatR;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace GoFoodBeverage.Application.Features.Orders.Queries
{
    public class AdminGetOrderHistoryByOrderIdRequest : IRequest<AdminGetOrderHistoryByOrderIdResponse>
    {
        public Guid Id { get; set; }

    }

    public class AdminGetOrderHistoryByOrderIdResponse
    {
        public IEnumerable<OrderHistoryResponse> DetailList { get; set; }

    }

    public class AdminGetOrderHistoryByOrderIdRequestHandle : IRequestHandler<AdminGetOrderHistoryByOrderIdRequest, AdminGetOrderHistoryByOrderIdResponse>
    {
        private readonly IOrderHistoryService _orderHistoryService;

        public AdminGetOrderHistoryByOrderIdRequestHandle(IOrderHistoryService orderHistoryService)
        {
            _orderHistoryService = orderHistoryService;
        }

        public async Task<AdminGetOrderHistoryByOrderIdResponse> Handle(AdminGetOrderHistoryByOrderIdRequest request, CancellationToken cancellationToken)
        {
            var orderHistory = await _orderHistoryService.GetListOrderHistoryByOrderId(request.Id, cancellationToken);

            var response = new AdminGetOrderHistoryByOrderIdResponse()
            {
                DetailList = orderHistory
            };
            return response;
        }
    }
}
