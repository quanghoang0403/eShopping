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
    public class AdminGetOrderHistoryByOrderIdRequest : IRequest<AdminGetOrderHistoryByOrderIdResponse>
    {
        public Guid Id { get; set; }

    }

    public class AdminGetOrderHistoryByOrderIdResponse
    {
        public IEnumerable<AdminOrderHistoryModel> DetailList { get; set; }
    }

    public class AdminGetOrderHistoryByOrderIdRequestHandle : IRequestHandler<AdminGetOrderHistoryByOrderIdRequest, AdminGetOrderHistoryByOrderIdResponse>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IUserProvider _userProvider;
        public AdminGetOrderHistoryByOrderIdRequestHandle(IUnitOfWork unitOfWork, IUserProvider userProvider)
        {
            _unitOfWork = unitOfWork;
            _userProvider = userProvider;
        }

        public async Task<AdminGetOrderHistoryByOrderIdResponse> Handle(AdminGetOrderHistoryByOrderIdRequest request, CancellationToken cancellationToken)
        {
            var loggedUser = await _userProvider.ProvideAsync(cancellationToken);

            var listAccount = await _unitOfWork.Accounts.GetAll().AsNoTracking().ToListAsync(cancellationToken);

            var orderHistories = await _unitOfWork.OrderHistories.Find(orderHistory => orderHistory.OrderId == request.Id).AsNoTracking().ToListAsync();
            var orderHistoryResponse = new List<AdminOrderHistoryModel>();
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
                        actor = "Admin";
                    }

                    orderHistoryResponse.Add(new AdminOrderHistoryModel()
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

            var response = new AdminGetOrderHistoryByOrderIdResponse()
            {
                DetailList = orderHistoryResponse.OrderByDescending(x => x.CreatedTime)
            };
            return response;
        }

    }
}
