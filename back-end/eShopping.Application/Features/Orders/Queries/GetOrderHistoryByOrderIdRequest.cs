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

namespace GoFoodBeverage.Application.Features.Orders.Queries
{
    public class GetOrderHistoryByOrderIdRequest : IRequest<GetOrderHistoryByOrderIdResponse>
    {
        public Guid Id { get; set; }

    }

    public class GetOrderHistoryByOrderIdResponse
    {
        public IEnumerable<OrderHistoryModel> DetailList { get; set; }
    }

    public class GetOrderHistoryByOrderIdRequestHandle : IRequestHandler<GetOrderHistoryByOrderIdRequest, GetOrderHistoryByOrderIdResponse>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IUserProvider _userProvider;
        public GetOrderHistoryByOrderIdRequestHandle(IUnitOfWork unitOfWork, IUserProvider userProvider)
        {
            _unitOfWork = unitOfWork;
            _userProvider = userProvider;
        }

        public async Task<GetOrderHistoryByOrderIdResponse> Handle(GetOrderHistoryByOrderIdRequest request, CancellationToken cancellationToken)
        {
            var loggedUser = await _userProvider.ProvideAsync(cancellationToken);

            var listAccount = await _unitOfWork.Accounts.GetAll().AsNoTracking().ToListAsync(cancellationToken);

            var orderHistories = await _unitOfWork.OrderHistories.Find(orderHistory => orderHistory.OrderId == request.Id).AsNoTracking().ToListAsync();
            var orderHistoryResponse = new List<OrderHistoryModel>();
            if (orderHistories != null)
            {
                foreach (var orderHistory in orderHistories)
                {
                    if (orderHistoryResponse.Any(e => e.ActionType == orderHistory.ActionType))
                    {
                        continue;
                    }

                    var actor = "";
                    if (orderHistory.CreatedUser != null)
                    {
                        var account = listAccount.FirstOrDefault(x => x.Id == orderHistory.CreatedUser);
                        if (account != null)
                        {
                            actor = account?.FullName;
                        }
                    }
                    else
                    {
                        actor = "";
                    }

                    orderHistoryResponse.Add(new OrderHistoryModel()
                    {
                        Id = orderHistory.Id,
                        OrderId = orderHistory.OrderId,
                        CreatedTime = orderHistory.CreatedTime,
                        PerformedBy = actor,
                        Note = orderHistory.ActionType == EnumOrderActionType.CANCEL ? orderHistory.CancelReason : orderHistory.Note,
                        ActionName = EnumOrderActionTypeExtensions.GetActionName(orderHistory.ActionType),
                        ActionType = orderHistory.ActionType,
                    });
                }
            }

            var response = new GetOrderHistoryByOrderIdResponse()
            {
                DetailList = orderHistoryResponse.OrderByDescending(x => x.CreatedTime)
            };
            return response;
        }

    }
}
