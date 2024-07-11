﻿using AutoMapper;
using eShopping.Common.Extensions;
using eShopping.Common.Models;
using eShopping.Interfaces;
using eShopping.MemoryCaching;
using eShopping.Models.ProductCategories;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace eShopping.Application.Features.ProductCategories.Queries
{
    public class StoreGetSearchPageRequest : IRequest<BaseResponseModel>
    {
        public string KeySearch { get; set; }
    }

    public class StoreGetSearchPageResponse
    {
        public string KeySearch { get; set; }
        public List<StoreProductRootCategoryModel> ProductRootCategories { get; set; }
        public List<StoreProductCategoryModel> ProductCategories { get; set; }
    }


    public class StoreGetSearchPageRequestHandler : IRequestHandler<StoreGetSearchPageRequest, BaseResponseModel>
    {
        private readonly IMemoryCachingService _memoryCachingService;
        private readonly IUserProvider _userProvider;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public StoreGetSearchPageRequestHandler(IMemoryCachingService memoryCachingService, IUserProvider userProvider, IUnitOfWork unitOfWork, IMapper mapper)
        {
            _memoryCachingService = memoryCachingService;
            _userProvider = userProvider;
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<BaseResponseModel> Handle(StoreGetSearchPageRequest request, CancellationToken cancellationToken)
        {
            string keySearch = !string.IsNullOrEmpty(request.KeySearch) ? request.KeySearch.Trim().ToLower() : "";

            var keyCache = string.Format(KeyCacheConstants.SearchPage, keySearch);
            var res = _memoryCachingService.GetCache<StoreGetSearchPageResponse>(keyCache);

            if (res == null)
            {
                res = new StoreGetSearchPageResponse() { KeySearch = request.KeySearch };

                var productRootCategories = await _unitOfWork.ProductRootCategories
                    .GetAll().Where(p => p.IsActive)
                    .OrderBy(x => x.Priority)
                    .ToListAsync();
                res.ProductRootCategories = _mapper.Map<List<StoreProductRootCategoryModel>>(productRootCategories);

                var productCategories = await _unitOfWork.ProductCategories
                    .GetAll().Where(p => p.IsActive)
                    .OrderBy(x => x.Priority)
                    .ToListAsync();
                res.ProductCategories = _mapper.Map<List<StoreProductCategoryModel>>(productCategories);
                _memoryCachingService.SetCache(keyCache, res);
            }

            return BaseResponseModel.ReturnData(res);
        }
    }
}
