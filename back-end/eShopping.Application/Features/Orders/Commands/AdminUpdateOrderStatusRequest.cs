using eShopping.Common.Constants;
using eShopping.Common.Models;
using eShopping.Domain.Entities;
using eShopping.Domain.Enums;
using eShopping.Interfaces;
using eShopping.Services.Hubs;
using MediatR;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace eShopping.Application.Features.Orders.Commands
{
    public class AdminUpdateOrderStatusRequest : IRequest<BaseResponseModel>
    {
        public Guid OrderId { get; set; }

        public EnumOrderStatus Status { get; set; }

        public string Note { get; set; }
    }

    public class AdminUpdateOrderStatusRequestHandle : IRequestHandler<AdminUpdateOrderStatusRequest, BaseResponseModel>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IUserProvider _userProvider;
        private readonly IHubContext<OrderHub> _hubContext;

        public AdminUpdateOrderStatusRequestHandle(IUnitOfWork unitOfWork, IUserProvider userProvider, IHubContext<OrderHub> hubContext)
        {
            _unitOfWork = unitOfWork;
            _userProvider = userProvider;
            _hubContext = hubContext;
        }

        public async Task<BaseResponseModel> Handle(AdminUpdateOrderStatusRequest request, CancellationToken cancellationToken)
        {
            var loggedUser = await _userProvider.ProvideAsync(cancellationToken);
            var accountId = loggedUser.AccountId.Value;
            var order = await _unitOfWork.Orders.Find(order => order.Id == request.OrderId).Include(o => o.OrderItems).FirstOrDefaultAsync(cancellationToken);
            if (order == null)
            {
                return BaseResponseModel.ReturnError("Cannot find order");
            }
            return await _unitOfWork.CreateExecutionStrategy().ExecuteAsync(async () =>
        {
            using var createTransaction = await _unitOfWork.BeginTransactionAsync();
            try
            {

                foreach (var item in order.OrderItems)
                {
                    var stock = await _unitOfWork.ProductStocks
                            .Where(x => item.ProductId == x.ProductId && item.ProductSizeId == x.ProductSizeId && item.ProductVariantId == x.ProductVariantId)
                            .FirstOrDefaultAsync();
                    if (request.Status == EnumOrderStatus.Returned || request.Status == EnumOrderStatus.Canceled)
                    {
                        stock.QuantityLeft += item.Quantity;
                    }
                    else if (order.Status == EnumOrderStatus.Canceled && request.Status == EnumOrderStatus.Confirmed)
                    {
                        stock.QuantityLeft -= item.Quantity;
                    }
                    item.LastSavedTime = DateTime.UtcNow;
                    item.LastSavedUser = accountId;
                }
                order.Status = request.Status;
                order.LastSavedUser = accountId;
                order.LastSavedTime = DateTime.Now;


                // Add order history
                var orderHistory = await _unitOfWork.OrderHistories.AddAsync(new OrderHistory()
                {
                    OrderId = order.Id,
                    ActionType = EnumOrderActionType.CANCEL,
                    Note = request.Note,
                    CreatedTime = DateTime.Now,
                    CreatedUser = accountId,
                });

                await _unitOfWork.SaveChangesAsync();
                await createTransaction.CommitAsync(cancellationToken);

            }
            catch (Exception err)
            {
                await createTransaction.RollbackAsync(cancellationToken);
                return BaseResponseModel.ReturnError(err.Message);
            }
            await _hubContext.Clients.All.SendAsync(OrderHubConstants.UPDATE_STATUS_BY_STAFF, order.CustomerId, order.Id, order.Status, cancellationToken);
            return BaseResponseModel.ReturnData();
        });
        }
    }
}
