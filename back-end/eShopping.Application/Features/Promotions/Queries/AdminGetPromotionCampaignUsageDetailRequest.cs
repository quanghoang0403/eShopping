﻿using eShopping.Common.Extensions;
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
    public class AdminGetPromotionCampaignUsageDetailRequest : IRequest<AdminGetPromotionCampaignUsageDetailResponse>
    {
        public Guid PromotionCampaignId { get; set; }

        public int PageNumber { get; set; }

        public int PageSize { get; set; }
    }

    public class AdminGetPromotionCampaignUsageDetailResponse
    {
        public List<AdminPromotionCampaignUsageDetailModel> PromotionCampaignUsageDetails { get; set; }

        public int PageNumber { get; set; }

        public int Total { get; set; }
    }

    public class AdminGetPromotionCampaignUsageDetailHandler : IRequestHandler<AdminGetPromotionCampaignUsageDetailRequest, AdminGetPromotionCampaignUsageDetailResponse>
    {
        private readonly IUserProvider _userProvider;
        private readonly IUnitOfWork _unitOfWork;

        public AdminGetPromotionCampaignUsageDetailHandler(
            IUserProvider userProvider,
            IUnitOfWork unitOfWork)
        {
            _userProvider = userProvider;
            _unitOfWork = unitOfWork;
        }

        public async Task<AdminGetPromotionCampaignUsageDetailResponse> Handle(AdminGetPromotionCampaignUsageDetailRequest request, CancellationToken cancellationToken)
        {
            var loggedUser = await _userProvider.ProvideAsync(cancellationToken);

            var ordersHavePromotionCampaign = await _unitOfWork.Orders
              .Where(order => order.OrderPromotionDetails.Any(orderPromotionDetail => orderPromotionDetail.PromotionId == request.PromotionCampaignId) &&
                              order.Status == EnumOrderStatus.Completed)
              .Select(o => new AdminPromotionCampaignUsageDetailModel
              {
                  OrderId = o.Id,
                  OrderCode = o.Code,
                  OrderDate = o.CreatedTime,
                  DiscountAmount = o.OrderPromotionDetails.Where(orderPromotionDetail => orderPromotionDetail.PromotionId == request.PromotionCampaignId)
                    .Sum(orderPromotionDetail => orderPromotionDetail.PromotionValue),
              })
              .AsNoTracking()
              .OrderByDescending(p => p.OrderDate)
              .ToPaginationAsync(request.PageNumber, request.PageSize);
            var usageDetails = ordersHavePromotionCampaign.Result.ToList();
            usageDetails.ForEach(item =>
            {
                item.No = usageDetails.IndexOf(item) + ((request.PageNumber - 1) * request.PageSize) + 1;
            });

            return new AdminGetPromotionCampaignUsageDetailResponse()
            {
                PromotionCampaignUsageDetails = usageDetails,
                PageNumber = request.PageNumber,
                Total = ordersHavePromotionCampaign.Total
            };
        }
    }
}