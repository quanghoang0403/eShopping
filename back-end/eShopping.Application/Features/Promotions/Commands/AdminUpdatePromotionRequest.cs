using eShopping.Common.Exceptions;
using eShopping.Common.Extensions;
using eShopping.Domain.Entities;
using eShopping.Domain.Enums;
using eShopping.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace eShopping.Application.Features.Promotions.Commands
{
    public class UpdatePromotionRequest : IRequest<bool>
    {
        public Guid Id { get; set; }

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

    public class UpdatePromotionRequestHandler : IRequestHandler<UpdatePromotionRequest, bool>
    {
        private readonly IUserProvider _userProvider;
        private readonly IUnitOfWork _unitOfWork;

        public UpdatePromotionRequestHandler(
            IUserProvider userProvider,
            IUnitOfWork unitOfWork
        )
        {
            _userProvider = userProvider;
            _unitOfWork = unitOfWork;
        }

        public async Task<bool> Handle(UpdatePromotionRequest request, CancellationToken cancellationToken)
        {
            var loggedUser = await _userProvider.ProvideAsync(cancellationToken);

            RequestValidationAsync(request);

            var promotion = await _unitOfWork.Promotions.GetPromotionByIdAsync(request.Id);

            if (promotion.Name.Trim().ToLower() != request.Name.Trim().ToLower())
            {
                var promotionNameExisted = await _unitOfWork.Promotions.GetAll().FirstOrDefaultAsync(p => p.Name.ToLower().Equals(request.Name.ToLower()));
                ThrowError.Against(promotionNameExisted != null, "Promotion name has already existed");
            }

            var promotionUpdate = await UpdatePromotion(promotion, request, loggedUser.AccountId.Value, cancellationToken);
            promotionUpdate.LastSavedUser = loggedUser.AccountId.Value;
            promotionUpdate.LastSavedTime = DateTime.UtcNow;
            await _unitOfWork.Promotions.UpdateAsync(promotionUpdate);

            return true;
        }

        private static void RequestValidationAsync(UpdatePromotionRequest request)
        {
            ThrowError.Against(string.IsNullOrEmpty(request.Name), "Please enter promotion name");
            ThrowError.BadRequestAgainstNull(request.PromotionTypeId, "Please select promotion type");
        }

        public async Task<Promotion> UpdatePromotion(Promotion promotion, UpdatePromotionRequest request, Guid accountId, CancellationToken cancellationToken)
        {
            promotion.Name = request.Name;
            promotion.PromotionTypeId = request.PromotionTypeId;
            promotion.IsPercentDiscount = request.IsPercentDiscount;
            promotion.PercentNumber = request.PercentNumber;
            promotion.MaximumDiscountAmount = request.MaximumDiscountAmount;
            promotion.StartDate = request.StartDate.ToUtcDateTime();
            promotion.EndDate = request.EndDate?.ToUtcDateTime();
            promotion.TermsAndCondition = request.TermsAndCondition;
            promotion.LastSavedUser = accountId;
            promotion.IsMinimumPurchaseAmount = request.IsMinimumPurchaseAmount;
            promotion.MinimumPurchaseAmount = request.MinimumPurchaseAmount;
            promotion.IsApplyAllCategories = request.IsApplyAllCategories && promotion.PromotionTypeId == EnumPromotion.DiscountProductCategory;
            promotion.IsApplyAllProducts = request.IsApplyAllProducts && promotion.PromotionTypeId == EnumPromotion.DiscountProduct;

            //Handle PromotionType
            if (promotion.IsApplyAllProducts && promotion.PromotionTypeId == EnumPromotion.DiscountProduct)
            {
                await DeleteProductCategoryItemsAsync(accountId, cancellationToken);
            }
            else if (promotion.IsApplyAllCategories && promotion.PromotionTypeId == EnumPromotion.DiscountProductCategory)
            {
                await DeleteProductItemsAsync(accountId, cancellationToken);
            }
            else if (request.PromotionTypeId == EnumPromotion.DiscountProduct)
            {
                var currentPromotionProductPrice = promotion.PromotionProducts.ToList();
                var newPromotionProductPrice = new List<PromotionProduct>();

                if (!request.ProductPriceIds.IsNullOrEmpty())
                {
                    //Delete
                    var deleteProductPriceItems = currentPromotionProductPrice.Where(price => !request.ProductPriceIds.Contains(price.ProductPriceId.Value));
                    await _unitOfWork.PromotionProducts.RemoveRangeAsync(deleteProductPriceItems);

                    //AddNew
                    request.ProductPriceIds.ForEach(productPriceId =>
                    {
                        var promotionProduct = currentPromotionProductPrice
                            .FirstOrDefault(p => p.ProductPriceId == productPriceId);
                        if (promotionProduct == null)
                        {
                            var newProductPrice = new PromotionProduct()
                            {
                                PromotionId = request.Id,
                                ProductPriceId = productPriceId,
                                CreatedUser = accountId,
                                LastSavedUser = accountId,
                            };
                            newPromotionProductPrice.Add(newProductPrice);
                        }
                    });
                    await _unitOfWork.PromotionProducts.AddRangeAsync(newPromotionProductPrice);
                }

                if (!promotion.PromotionProductCategories.IsNullOrEmpty())
                {
                    await _unitOfWork.PromotionProductCategories.RemoveRangeAsync(promotion.PromotionProductCategories.ToList());
                }
            }
            else if (request.ProductCategoryIds != null && request.PromotionTypeId == EnumPromotion.DiscountProductCategory)
            {
                var currentPromotionProductCategory = promotion.PromotionProductCategories.ToList();
                var newPromotionProductCategory = new List<PromotionProductCategory>();

                if (request.ProductCategoryIds != null && request.ProductCategoryIds.Any())
                {
                    //Delete
                    var deleteItems = currentPromotionProductCategory
                        .Where(x => !request.ProductCategoryIds.Contains(x.ProductCategoryId));

                    await _unitOfWork.PromotionProductCategories.RemoveRangeAsync(deleteItems);

                    //AddNew
                    request.ProductCategoryIds.ForEach(productCategoryId =>
                    {
                        var promotionProductCategory = currentPromotionProductCategory.FirstOrDefault(pc => pc.ProductCategoryId == productCategoryId);
                        if (promotionProductCategory == null)
                        {
                            var newProductCategory = new PromotionProductCategory()
                            {
                                PromotionId = request.Id,
                                ProductCategoryId = productCategoryId,
                                CreatedUser = accountId,
                                LastSavedUser = accountId,
                            };
                            newPromotionProductCategory.Add(newProductCategory);
                        }
                    });

                    await _unitOfWork.PromotionProductCategories.AddRangeAsync(newPromotionProductCategory);
                }

                if (!promotion.PromotionProducts.IsNullOrEmpty())
                {
                    await _unitOfWork.PromotionProducts.RemoveRangeAsync(promotion.PromotionProducts.ToList());
                }
            }

            return promotion;
        }

        private async Task DeleteProductItemsAsync(Guid discountId, CancellationToken cancellationToken)
        {
            var deleteProductItems = await _unitOfWork.PromotionProducts.Find(product => product.PromotionId == discountId).ToListAsync(cancellationToken);
            await _unitOfWork.PromotionProducts.RemoveRangeAsync(deleteProductItems);
        }

        private async Task DeleteProductCategoryItemsAsync(Guid discountId, CancellationToken cancellationToken)
        {
            var deleteProductCategoryItems = await _unitOfWork.PromotionProductCategories.Find(x => x.PromotionId == discountId)
                            .ToListAsync(cancellationToken);
            await _unitOfWork.PromotionProductCategories.RemoveRangeAsync(deleteProductCategoryItems);
        }
    }
}
