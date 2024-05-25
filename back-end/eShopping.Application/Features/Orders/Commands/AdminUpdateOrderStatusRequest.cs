using eShopping.Common.Models;
using eShopping.Domain.Entities;
using eShopping.Domain.Enums;
using eShopping.Interfaces;
using MediatR;
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
            using var createTransaction = await _unitOfWork.BeginTransactionAsync();
            if (order != null)
            {
                order.Status = request.Status;

                foreach (var item in order.OrderItems)
                {
                    var stock = await _unitOfWork.ProductStocks
                        .Where(x => item.ProductId == x.ProductId && item.ProductSizeId == x.ProductSizeId && item.ProductVariantId == x.ProductVariantId)
                        .FirstOrDefaultAsync();
                    if (request.Status == EnumOrderStatus.Returned || request.Status == EnumOrderStatus.Canceled)
                    {
                        stock.QuantityLeft += item.Quantity;
                    }
                    item.LastSavedTime = DateTime.UtcNow;
                    item.LastSavedUser = accountId;
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
