using AutoMapper;
using eShopping.Common.Extensions;
using eShopping.Common.Models;
using eShopping.Domain.Entities;
using eShopping.Domain.Enums;
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
    public class StoreGetMenuCategoryRequest : IRequest<BaseResponseModel>
    {
    }

    public class StoreGetMenuCategoryRequestHandler : IRequestHandler<StoreGetMenuCategoryRequest, BaseResponseModel>
    {
        private readonly IUserProvider _userProvider;
        private readonly IMemoryCachingService _memoryCachingService;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public StoreGetMenuCategoryRequestHandler(IUserProvider userProvider, IMemoryCachingService memoryCachingService, IUnitOfWork unitOfWork, IMapper mapper)
        {
            _userProvider = userProvider;
            _memoryCachingService = memoryCachingService;
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<BaseResponseModel> Handle(StoreGetMenuCategoryRequest request, CancellationToken cancellationToken)
        {
            var res = _memoryCachingService.GetCache<List<StoreMenuCategoryModel>>(KeyCacheConstants.Menu);
            if (res == null)
            {
                var rootCategories = await _unitOfWork.ProductRootCategories
                .GetAll().Where(p => p.IsActive)
                .Include(x => x.ProductCategories)
                .OrderBy(x => x.Priority)
                .AsNoTracking()
                .ToListAsync();

                res = new List<StoreMenuCategoryModel>() {
                    new()
                    {
                        GenderProduct = EnumGenderProduct.Male,
                        ProductRootCategories = MapMenuModel(rootCategories, EnumGenderProduct.Male)
                    },
                    new()
                    {
                        GenderProduct = EnumGenderProduct.Female,
                        ProductRootCategories = MapMenuModel(rootCategories, EnumGenderProduct.Female)
                    },
                    new()
                    {
                        GenderProduct = EnumGenderProduct.Kid,
                        ProductRootCategories = MapMenuModel(rootCategories, EnumGenderProduct.Kid)
                    },
                };
                _memoryCachingService.SetCache(KeyCacheConstants.Menu, res, TimeCacheConstants.DateMonth);
            }
            return BaseResponseModel.ReturnData(res);
        }

        private List<StoreNavigationModel> MapMenuModel(List<ProductRootCategory> productRootCategories, EnumGenderProduct gender)
        {
            var menuCategories = productRootCategories
                .Where(x => x.GenderProduct == EnumGenderProduct.All || x.GenderProduct == gender)
                .Select(x => new StoreNavigationModel()
                {
                    Id = x.Id,
                    Name = x.Name,
                    UrlSEO = $"/collection/{gender.GetDescription()}/{x.UrlSEO}",
                    Type = "megaMenu",
                    Children = x.ProductCategories
                        .Where(c => c.GenderProduct == EnumGenderProduct.All || c.GenderProduct == gender)
                        .Select(c => new StoreNavigationModel() { Id = c.Id, Name = c.Name, UrlSEO = $"/collection/{gender.GetDescription()}/{x.UrlSEO}/{c.UrlSEO}" })
                }).ToList();
            return menuCategories;
        }
    }
}
