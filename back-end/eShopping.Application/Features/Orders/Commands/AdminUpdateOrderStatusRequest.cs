using eShopping.Common.Models;
using eShopping.Domain.Entities;
using eShopping.Domain.Enums;
using eShopping.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
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

        public AdminUpdateOrderStatusRequestHandle(IUnitOfWork unitOfWork, IUserProvider userProvider)
        {
            _unitOfWork = unitOfWork;
            _userProvider = userProvider;
        }

        public async Task<BaseResponseModel> Handle(AdminUpdateOrderStatusRequest request, CancellationToken cancellationToken)
        {
            var loggedUser = await _userProvider.ProvideAsync(cancellationToken);
            var accountId = loggedUser.AccountId.Value;
            var order = await _unitOfWork.Orders.Find(order => order.Id == request.OrderId).Include(o => o.OrderItems).FirstOrDefaultAsync(cancellationToken);
            var prices = await _unitOfWork.ProductPrices
                .Where(x => order.OrderItems.Select(cart => cart.ProductPriceId).Contains(x.Id)).ToListAsync();
            return await _unitOfWork.CreateExecutionStrategy().ExecuteAsync(async () =>
            {
                using var createTransaction = await _unitOfWork.BeginTransactionAsync();
                if (order != null)
                {
                    order.Status = request.Status;

                    foreach (var item in order.OrderItems)
                    {
                        var price = prices.FirstOrDefault(p => p.Id == item.ProductPriceId);
                        var orderItem = order.OrderItems.Where(i => i.ProductPriceId == price.Id).FirstOrDefault();
                        if (request.Status == EnumOrderStatus.Returned || request.Status == EnumOrderStatus.Canceled)
                        {
                            price.QuantityLeft += orderItem.Quantity;
                            price.QuantitySold -= orderItem.Quantity;
                        }
                        else if (request.Status == EnumOrderStatus.Confirmed)
                        {
                            if (price.QuantityLeft < orderItem.Quantity)
                            {
                                return BaseResponseModel.ReturnError("This product is out of stock");
                            }
                            price.QuantityLeft -= orderItem.Quantity;
                            price.QuantitySold += orderItem.Quantity;
                        }
                        price.LastSavedTime = DateTime.UtcNow;
                        price.LastSavedUser = accountId;
                    }

                    order.LastSavedUser = accountId;
                    order.LastSavedTime = DateTime.Now;
                }

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
                return BaseResponseModel.ReturnData();
            });

        }
    }
}
