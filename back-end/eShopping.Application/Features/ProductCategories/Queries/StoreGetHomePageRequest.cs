﻿using AutoMapper;
using eShopping.Common.Extensions;
using eShopping.Common.Models;
using eShopping.Interfaces;
using eShopping.MemoryCaching;
using eShopping.Models.Products;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace eShopping.Application.Features.ProductCategories.Queries
{
    public class StoreGetHomePageRequest : IRequest<BaseResponseModel>
    {
    }

    public class StoreGetHomePageResponse
    {
        public List<StoreProductModel> DiscountedProducts { get; set; }
        public List<StoreProductModel> FeaturedProducts { get; set; }
        public List<StoreProductModel> NewInProducts { get; set; }
    }


    public class StoreGetHomePageRequestHandler : IRequestHandler<StoreGetHomePageRequest, BaseResponseModel>
    {
        private readonly IMemoryCachingService _memoryCachingService;
        private readonly IUserProvider _userProvider;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public StoreGetHomePageRequestHandler(IMemoryCachingService memoryCachingService, IUserProvider userProvider, IUnitOfWork unitOfWork, IMapper mapper)
        {
            _memoryCachingService = memoryCachingService;
            _userProvider = userProvider;
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<BaseResponseModel> Handle(StoreGetHomePageRequest request, CancellationToken cancellationToken)
        {
            var keyCache = string.Format(KeyCacheConstants.HomePage);
            var res = _memoryCachingService.GetCache<StoreGetHomePageResponse>(keyCache);

            if (res == null)
            {
                var query = _unitOfWork.Products
                    .GetAll()
                    .Include(x => x.ProductVariants)
                    .Include(p => p.ProductCategory)
                    .Include(p => p.ProductRootCategory)
                    .Include(p => p.ProductSizeCategory.ProductSizes)
                    .Include(p => p.ProductStocks)
                    .AsNoTracking();

                var discountedProducts = await query
                    .Where(p => p.IsDiscounted == true && p.IsActive)
                    .OrderByDescending(p => p.PercentNumber)
                    .ThenBy(p => p.Priority)
                    .Take(12)
                    .ToListAsync();

                var featuredProducts = await query
                    .Where(p => p.IsFeatured == true && p.IsActive && !discountedProducts.Any(dp => dp.Id == p.Id))
                    .OrderBy(p => p.Priority)
                    .Take(12)
                    .ToListAsync();

                var newInProducts = await _unitOfWork.Products
                    .Where(p => p.CreatedTime > DateTime.Now.AddDays(-14) && p.IsActive && !discountedProducts.Any(dp => dp.Id == p.Id) && !featuredProducts.Any(fp => fp.Id == p.Id))
                    .OrderBy(p => p.CreatedTime)
                    .Take(12)
                    .ToListAsync();

                res = new StoreGetHomePageResponse()
                {
                    DiscountedProducts = _mapper.Map<List<StoreProductModel>>(discountedProducts),
                    FeaturedProducts = _mapper.Map<List<StoreProductModel>>(featuredProducts),
                    NewInProducts = _mapper.Map<List<StoreProductModel>>(newInProducts)
                };
                _memoryCachingService.SetCache(keyCache, res);
            }

            return BaseResponseModel.ReturnData(res);
        }
    }
}