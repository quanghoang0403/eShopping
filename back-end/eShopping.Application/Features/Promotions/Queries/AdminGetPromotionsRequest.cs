using AutoMapper;
using eShopping.Common.Extensions;
using eShopping.Domain.Entities;
using eShopping.Domain.Enums;
using eShopping.Interfaces;
using eShopping.Models.Promotions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace eShopping.Application.Features.Promotions.Queries
{
    public class GetPromotionsRequest : IRequest<GetPromotionsResponse>
    {
        public int PageNumber { get; set; }

        public int PageSize { get; set; }

        public string KeySearch { get; set; }

        public EnumPromotionStatus? StatusId { get; set; }

        public int? ValueType { get; set; }

        public DateTime? StartDate { get; set; }

        public DateTime? EndDate { get; set; }

        public int? MinMinimumPurchaseOnBill { get; set; }

        public int? MaxMinimumPurchaseOnBill { get; set; }

        public EnumPromotion? ApplicableType { get; set; }

    }

    public class GetPromotionsResponse
    {
        public IEnumerable<PromotionModel> Promotions { get; set; }

        public int PageNumber { get; set; }

        public int Total { get; set; }
    }

    public class GetPromotionsRequestHandler : IRequestHandler<GetPromotionsRequest, GetPromotionsResponse>
    {
        private readonly IUserProvider _userProvider;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public GetPromotionsRequestHandler(
            IUserProvider userProvider,
            IUnitOfWork unitOfWork,
            IMapper mapper
           )
        {
            _userProvider = userProvider;
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<GetPromotionsResponse> Handle(GetPromotionsRequest request, CancellationToken cancellationToken)
        {
            var loggedUser = await _userProvider.ProvideAsync(cancellationToken);
            var EnumPromotion = new List<Promotion>();

            string keySearch = String.IsNullOrEmpty(request.KeySearch) ? "" : request.KeySearch.Trim().ToLower();
            EnumPromotion = await _unitOfWork.Promotions
                                  .Where(s => string.IsNullOrEmpty(keySearch) || s.Name.ToLower().Contains(keySearch))
                                  .AsNoTracking()
                                  .OrderByDescending(p => p.CreatedTime)
                                  .ToListAsync(cancellationToken);

            var promotionListResponse = _mapper.Map<List<PromotionModel>>(EnumPromotion);

            // Manually mapping
            promotionListResponse.ForEach(item =>
            {
                if (item.IsStopped)
                {
                    item.StatusId = (int)EnumPromotionStatus.Finished;
                }
                else
                {
                    item.StatusId = (int)GetPromotionStatus(item.StartDate, item.EndDate);
                }
            });

            if (request.StatusId != null)
            {
                promotionListResponse = promotionListResponse.Where(x => x.StatusId == (int)request.StatusId).ToList();
            }

            if (request.ValueType != null)
            {
                promotionListResponse = promotionListResponse.Where(x => x.IsPercentDiscount == (request.ValueType == 1)).ToList();
            }

            if (request.StartDate != null && request.EndDate == null)
            {
                promotionListResponse = promotionListResponse.Where(x => x.EndDate == null || x.EndDate.Value.Date >= request.StartDate.Value.Date).ToList();
            }

            if (request.StartDate == null && request.EndDate != null)
            {
                promotionListResponse = promotionListResponse.Where(x => x.StartDate.Date <= request.EndDate.Value.Date).ToList();
            }

            if (request.StartDate != null)
            {
                promotionListResponse = promotionListResponse.Where(x => x.StartDate >= request.StartDate.Value.Date.ToUtcDateTime()).ToList();
            }

            if (request.EndDate != null)
            {
                DateTime? endDate = request.EndDate.Value.EndOfDay().ToUtcDateTime();
                promotionListResponse = promotionListResponse.Where(x => x.EndDate != null && x.EndDate <= endDate).ToList();
            }

            if (request.MinMinimumPurchaseOnBill != null && request.MaxMinimumPurchaseOnBill == null)
            {
                promotionListResponse = promotionListResponse.Where(x => x.IsMinimumPurchaseAmount == true && x.MinimumPurchaseAmount >= request.MinMinimumPurchaseOnBill.Value).ToList();
            }

            if (request.MinMinimumPurchaseOnBill == null && request.MaxMinimumPurchaseOnBill != null)
            {
                promotionListResponse = promotionListResponse.Where(x => x.IsMinimumPurchaseAmount == true && x.MinimumPurchaseAmount <= request.MaxMinimumPurchaseOnBill.Value).ToList();
            }

            if (request.MinMinimumPurchaseOnBill != null && request.MaxMinimumPurchaseOnBill != null)
            {
                promotionListResponse = promotionListResponse.Where(x => x.IsMinimumPurchaseAmount == true && x.MinimumPurchaseAmount >= request.MinMinimumPurchaseOnBill.Value && x.MinimumPurchaseAmount <= request.MaxMinimumPurchaseOnBill.Value).ToList();
            }

            if (request.ApplicableType != null)
            {
                promotionListResponse = promotionListResponse.Where(x => x.PromotionTypeId == (int)request.ApplicableType).ToList();
            }

            var promotionListResponsePaging = promotionListResponse.ToPagination(request.PageNumber, request.PageSize).Result.ToList();

            var index = 0;
            foreach (var promotion in promotionListResponsePaging)
            {
                promotion.No = index + ((request.PageNumber - 1) * request.PageSize) + 1;
                index++;
            }

            var response = new GetPromotionsResponse()
            {
                PageNumber = request.PageNumber,
                Total = promotionListResponse.Count,
                Promotions = promotionListResponsePaging
            };

            return response;
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
    }
}
