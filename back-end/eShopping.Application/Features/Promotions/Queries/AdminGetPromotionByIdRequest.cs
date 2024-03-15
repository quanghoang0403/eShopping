using AutoMapper;
using eShopping.Domain.Enums;
using eShopping.Interfaces;
using eShopping.Models.Promotions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace eShopping.Application.Features.Promotions.Queries
{
    public class AdminGetPromotionByIdRequest : IRequest<AdminGetPromotionByIdResponse>
    {
        public Guid Id { get; set; }
    }

    public class AdminGetPromotionByIdResponse
    {
        public AdminPromotionDetailModel Promotion { get; set; }

        public bool IsSuccess { get; set; }

        public int TotalDiscountOrder { get; set; }

        public decimal TotalDiscountAmount { get; set; }
    }

    public class AdminGetPromotionByIdRequestHandler : IRequestHandler<AdminGetPromotionByIdRequest, AdminGetPromotionByIdResponse>
    {
        private readonly IUserProvider _userProvider;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public AdminGetPromotionByIdRequestHandler(
            IUserProvider userProvider,
            IUnitOfWork unitOfWork,
            IMapper mapper)
        {
            _userProvider = userProvider;
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<AdminGetPromotionByIdResponse> Handle(AdminGetPromotionByIdRequest request, CancellationToken cancellationToken)
        {
            var loggedUser = await _userProvider.ProvideAsync(cancellationToken);
            var promotion = await _unitOfWork.Promotions.GetPromotionByIdAsync(request.Id);
            var (totalDiscountOrder, totalDiscountAmount) = await CalculateDiscountAmount(request.Id, cancellationToken);

            var isSuccess = true;
            if (promotion == null)
            {
                isSuccess = false;
            }

            var promotionDetail = _mapper.Map<AdminPromotionDetailModel>(promotion);
            if (promotion.IsStopped.HasValue && promotion.IsStopped.Value)
            {
                promotionDetail.StatusId = (int)EnumPromotionStatus.Finished;
            }
            else
            {
                promotionDetail.StatusId = (int)GetPromotionStatus(promotion.StartDate, promotion.EndDate);
            }

            return new AdminGetPromotionByIdResponse()
            {
                Promotion = promotionDetail,
                IsSuccess = isSuccess,
                TotalDiscountOrder = totalDiscountOrder,
                TotalDiscountAmount = totalDiscountAmount,
            };

        }

        private static EnumPromotionStatus GetPromotionStatus(DateTime startDate, DateTime? dueDate)
        {
            var nowUtcDate = DateTime.UtcNow;

            if (startDate > nowUtcDate)
            {
                return EnumPromotionStatus.Scheduled;
            }
            else if (startDate == nowUtcDate)
            {
                return EnumPromotionStatus.Active;
            }
            else
            {
                if (dueDate.HasValue)
                {
                    return dueDate < nowUtcDate ? EnumPromotionStatus.Finished : EnumPromotionStatus.Active;
                }

                return EnumPromotionStatus.Active;
            }
        }

        private async Task<(int, decimal)> CalculateDiscountAmount(Guid promotionId, CancellationToken cancellationToken)
        {
            int totalDiscountOrder = 0;
            decimal totalDiscountAmount = 0;

            var orderPromotionDetails = await _unitOfWork.OrderPromotionDetails
             .Where(orderPromotionDetail => orderPromotionDetail.PromotionId == promotionId && orderPromotionDetail.Order.Status == EnumOrderStatus.Completed)
             .AsNoTracking()
             .Select(orderPromotionDetail => new { orderPromotionDetail.PromotionValue, orderPromotionDetail.OrderId })
             .ToListAsync(cancellationToken);

            if (orderPromotionDetails != null && orderPromotionDetails.Any())
            {
                totalDiscountOrder = orderPromotionDetails.GroupBy(orderPromotionDetail => orderPromotionDetail.OrderId).Count();
                totalDiscountAmount = orderPromotionDetails.Sum(orderPromotionDetail => orderPromotionDetail.PromotionValue);
            }

            return (totalDiscountOrder, totalDiscountAmount);
        }
    }
}
