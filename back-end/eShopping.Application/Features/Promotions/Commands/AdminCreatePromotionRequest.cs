using eShopping.Common.Exceptions;
using eShopping.Common.Extensions;
using eShopping.Domain.Entities;
using eShopping.Domain.Enums;
using eShopping.Interfaces;
using MediatR;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace eShopping.Application.Features.Promotions.Commands
{
    public class CreatePromotionRequest : IRequest<bool>
    {
        public string Name { get; set; }

        public EnumPromotion PromotionTypeId { get; set; }

        public bool IsPercentDiscount { get; set; }

        public decimal PercentNumber { get; set; }

        public decimal MaximumDiscountAmount { get; set; }

        public DateTime StartDate { get; set; }

        public DateTime? EndDate { get; set; }

        public string TermsAndCondition { get; set; }

        public bool? IsMinimumPurchaseAmount { get; set; }

        public decimal? MinimumPurchaseAmount { get; set; }

        public bool IsApplyAllProducts { get; set; }

        public bool IsApplyAllCategories { get; set; }

        public List<Guid> ProductIds { get; set; }

        public List<Guid> ProductPriceIds { get; set; }

        public List<Guid> ProductCategoryIds { get; set; }

    }

    public class CreatePromotionRequestHandler : IRequestHandler<CreatePromotionRequest, bool>
    {
        private readonly IUserProvider _userProvider;
        private readonly IUnitOfWork _unitOfWork;

        public CreatePromotionRequestHandler(
            IUserProvider userProvider,
            IUnitOfWork unitOfWork)
        {
            _userProvider = userProvider;
            _unitOfWork = unitOfWork;
        }

        public async Task<bool> Handle(CreatePromotionRequest request, CancellationToken cancellationToken)
        {
            var loggedUser = await _userProvider.ProvideAsync(cancellationToken);

            RequestValidation(request);

            var promotion = await CreatePromotion(request, loggedUser.AccountId.Value, cancellationToken);
            await _unitOfWork.Promotions.AddAsync(promotion);

            return true;
        }

        private static void RequestValidation(CreatePromotionRequest request)
        {
            ThrowError.Against(string.IsNullOrEmpty(request.Name), "Please enter promotion name");
        }

        private async Task<Promotion> CreatePromotion(CreatePromotionRequest request, Guid accountId, CancellationToken cancellationToken)
        {
            var newPromotion = new Promotion()
            {
                Name = request.Name,
                PromotionTypeId = request.PromotionTypeId,
                IsPercentDiscount = request.IsPercentDiscount,
                PercentNumber = request.PercentNumber,
                MaximumDiscountAmount = request.MaximumDiscountAmount,
                StartDate = request.StartDate.ToUtcDateTime(),
                TermsAndCondition = request.TermsAndCondition,
                IsStopped = false,
                IsApplyAllCategories = request.IsApplyAllCategories && request.PromotionTypeId == EnumPromotion.DiscountProductCategory,
                IsApplyAllProducts = request.IsApplyAllProducts && request.PromotionTypeId == EnumPromotion.DiscountProduct,
                CreatedUser = accountId,
                CreatedTime = DateTime.UtcNow,
            };

            if (request.EndDate.HasValue)
            {
                newPromotion.EndDate = request.EndDate.Value.ToUtcDateTime();
            }

            if (request.PromotionTypeId == EnumPromotion.DiscountProduct)
            {
                if (!newPromotion.IsApplyAllProducts)
                {
                    if (!request.ProductPriceIds.IsNullOrEmpty())
                    {
                        var promotionProducts = new List<PromotionProduct>();
                        request.ProductPriceIds.ForEach(priceId =>
                        {
                            var promotionProduct = new PromotionProduct()
                            {
                                PromotionId = newPromotion.Id,
                                ProductPriceId = priceId,
                                CreatedUser = accountId,
                                CreatedTime = DateTime.UtcNow,
                            };
                            promotionProducts.Add(promotionProduct);
                        });
                        newPromotion.PromotionProducts = promotionProducts;
                    }
                }
            }
            else if (request.PromotionTypeId == EnumPromotion.DiscountProductCategory)
            {
                if (!newPromotion.IsApplyAllCategories)
                {
                    var promotionProductCategorys = new List<PromotionProductCategory>();
                    request.ProductCategoryIds.ForEach(p =>
                    {
                        var promotionProductCategory = new PromotionProductCategory()
                        {
                            PromotionId = newPromotion.Id,
                            ProductCategoryId = p,
                            CreatedUser = accountId,
                            CreatedTime = DateTime.UtcNow,
                        };
                        promotionProductCategorys.Add(promotionProductCategory);
                    });
                    newPromotion.PromotionProductCategories = promotionProductCategorys;
                }
            }
            else
            {
                newPromotion.IsMinimumPurchaseAmount = request.IsMinimumPurchaseAmount;
                if (request.IsMinimumPurchaseAmount.Value)
                {
                    newPromotion.MinimumPurchaseAmount = request.MinimumPurchaseAmount;
                }
            };

            return newPromotion;
        }
    }
}
