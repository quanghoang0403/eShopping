﻿using AutoMapper;
using AutoMapper.QueryableExtensions;
using eShopping.Common.Exceptions;
using eShopping.Domain.Enums;
using eShopping.Interfaces;
using eShopping.Models.Commons;
using eShopping.Models.Products;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace eShopping.Application.Features.Products.Queries
{
    public class GetProductByIdRequest : IRequest<GetProductByIdResponse>
    {
        public Guid Id { get; set; }
    }

    public class GetProductByIdResponse
    {
        public ProductDetailModel Product { get; set; }

    }

    public class GetProductByIdRequestHandler : IRequestHandler<GetProductByIdRequest, GetProductByIdResponse>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IDateTimeService _dateTimeService;
        private readonly IUserProvider _userProvider;
        private readonly MapperConfiguration _mapperConfiguration;
        private readonly IMapper _mapper;

        public GetProductByIdRequestHandler(
            IUnitOfWork unitOfWork,
            IDateTimeService dateTimeService,
            IUserProvider userProvider,
            MapperConfiguration mapperConfiguration,
            IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _dateTimeService = dateTimeService;
            _userProvider = userProvider;
            _mapperConfiguration = mapperConfiguration;
            _mapper = mapper;
        }

        public async Task<GetProductByIdResponse> Handle(GetProductByIdRequest request, CancellationToken cancellationToken)
        {
            var loggedUser = await _userProvider.ProvideAsync(cancellationToken);

            var ProductData = await _unitOfWork.Products
                .Find(p => p.Id == request.Id)
                .AsNoTracking()
                .Include(x => x.ProductPrices)
                .Include(x => x.Images)
                .Include(p => p.ProductInCategories)
                .ProjectTo<ProductDetailModel>(_mapperConfiguration)
                .FirstOrDefaultAsync(cancellationToken: cancellationToken);

            ThrowError.Against(ProductData == null, "Cannot find product detail information");
            var images = _unitOfWork.Images.GetAllImagesByObjectId(ProductData.Id, EnumImageTypeObject.Product);
            var category = await _unitOfWork.ProductCategories.GetProductCategoryListByProductId(ProductData.Id).ProjectTo<ProductCategoryModel>(_mapperConfiguration).ToListAsync(cancellationToken);
            ProductData.Images = _mapper.Map<List<ImageModel>>(images);
            ProductData.ProductCategories = category;

            // Check discount
            var today = _dateTimeService.NowUtc;
            var allPromotions = await _unitOfWork.Promotions
                .Where(item => item.IsStopped != true
                    && today >= item.StartDate
                    && (item.EndDate == null || today <= item.EndDate.Value)
                    && (item.PromotionTypeId != (int)EnumPromotion.DiscountTotal))
                .Include(item => item.PromotionProductCategories)
                .Include(item => item.PromotionProducts)
                .ToListAsync(cancellationToken: cancellationToken);

            var listPromotionProductCategory = allPromotions
                .Where(item => item.PromotionTypeId == EnumPromotion.DiscountProductCategory
                && (item.IsApplyAllCategories || item.PromotionProductCategories.Any(promotion => category.Any(c => c.Id == promotion.ProductCategoryId))));
            var listPromotionProductSpecific = allPromotions
                .Where(item => item.PromotionTypeId == EnumPromotion.DiscountProduct
                && (item.IsApplyAllProducts || item.PromotionProducts.Any(promotion => ProductData.ProductPrices.Any(price => price.Id == promotion.ProductPriceId) || promotion.ProductId == ProductData.Id)));

            var promotions = listPromotionProductCategory.Concat(listPromotionProductSpecific);
            if (promotions.Any() && promotions != null)
            {
                // TO DO
            }

            return new GetProductByIdResponse
            {
                Product = ProductData,
            };
        }
    }
}
