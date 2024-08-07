﻿using AutoMapper;
using eShopping.Common.Extensions;
using eShopping.Common.Models;
using eShopping.Domain.Enums;
using eShopping.Interfaces;
using eShopping.MemoryCaching;
using eShopping.Models.ProductCategories;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace eShopping.Application.Features.ProductCategories.Queries
{
    public class StoreGetCollectionPageByUrlRequest : IRequest<BaseResponseModel>
    {
        public List<string> Slugs { get; set; }
    }

    public class StoreGetCollectionPageByUrlResponse
    {
        public EnumGenderProduct GenderProduct { get; set; }
        public Guid? ProductRootCategoryId { get; set; }
        public Guid? ProductCategoryId { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string TitleSEO { get; set; }
        public string DescriptionSEO { get; set; }
        public string KeywordSEO { get; set; }
        public List<StoreProductRootCategoryModel> ProductRootCategories { get; set; }
        public List<StoreProductCategoryModel> ProductCategories { get; set; }
    }


    public class StoreGetCollectionPageByUrlRequestHandler : IRequestHandler<StoreGetCollectionPageByUrlRequest, BaseResponseModel>
    {
        private readonly IMemoryCachingService _memoryCachingService;
        private readonly IUserProvider _userProvider;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public StoreGetCollectionPageByUrlRequestHandler(IMemoryCachingService memoryCachingService, IUserProvider userProvider, IUnitOfWork unitOfWork, IMapper mapper)
        {
            _memoryCachingService = memoryCachingService;
            _userProvider = userProvider;
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<BaseResponseModel> Handle(StoreGetCollectionPageByUrlRequest request, CancellationToken cancellationToken)
        {
            if (request.Slugs == null || request.Slugs.Count == 0)
            {
                return BaseResponseModel.ReturnError("Không tìm thấy trang");
            }

            var keyCache = string.Format(KeyCacheConstants.CollectionPage, string.Join(",", request.Slugs));
            var res = _memoryCachingService.GetCache<StoreGetCollectionPageByUrlResponse>(keyCache);

            if (res == null)
            {
                res = new StoreGetCollectionPageByUrlResponse();
                var slugGender = request.Slugs.Count > 0 ? request.Slugs[0] : null;
                var slugProductRootCategory = request.Slugs.Count > 1 ? request.Slugs[1] : null;
                var slugProductCategory = request.Slugs.Count > 2 ? request.Slugs[2] : null;

                if (slugGender == "nam")
                {
                    res.GenderProduct = EnumGenderProduct.Male;
                    res.Name = "Thời trang nam";
                    res.Description = "Năng động, khoẻ khoắn, lịch thiệp";
                    res.TitleSEO = "Thời trang nam | Mua sắm thời trang nam trực tuyến";
                    res.DescriptionSEO = "Khám phá bộ sưu tập thời trang nam năng động, khoẻ khoắn, lịch thiệp. Mua sắm trực tuyến ngay hôm nay!";
                    res.KeywordSEO = "thời trang nam, quần áo nam, mua sắm nam";
                }
                else if (slugGender == "nu")
                {
                    res.GenderProduct = EnumGenderProduct.Female;
                    res.Name = "Thời trang nữ";
                    res.Description = "Tự tin khoe cá tính";
                    res.TitleSEO = "Thời trang nữ | Mua sắm thời trang nữ trực tuyến";
                    res.DescriptionSEO = "Khám phá bộ sưu tập thời trang nữ tự tin, khoe cá tính. Mua sắm trực tuyến ngay hôm nay!";
                    res.KeywordSEO = "thời trang nữ, quần áo nữ, mua sắm nữ";
                }
                else if (slugGender == "kid")
                {
                    res.GenderProduct = EnumGenderProduct.Kid;
                    res.Name = "Thời trang trẻ em";
                    res.Description = "Cho bé thoả sức vui chơi";
                    res.TitleSEO = "Thời trang trẻ em | Mua sắm thời trang trẻ em trực tuyến";
                    res.DescriptionSEO = "Khám phá bộ sưu tập thời trang trẻ em cho bé thoả sức vui chơi. Mua sắm trực tuyến ngay hôm nay!";
                    res.KeywordSEO = "thời trang trẻ em, quần áo trẻ em, mua sắm trẻ em";
                }
                else
                {
                    return BaseResponseModel.ReturnError("Không tìm thấy trang");
                }

                if (slugProductRootCategory != null)
                {
                    var productRootCategory = await _unitOfWork.ProductRootCategories.GetProductRootCategoryDetailByUrlAsync(slugProductRootCategory);
                    if (productRootCategory == null) return BaseResponseModel.ReturnError("Không tìm thấy trang");
                    res.ProductRootCategoryId = productRootCategory.Id;
                    res.Name = $"Bộ sưu tập {productRootCategory.Name}";
                    res.Description = productRootCategory.Description;
                    res.TitleSEO = productRootCategory.TitleSEO;
                    res.DescriptionSEO = productRootCategory.DescriptionSEO;
                    res.KeywordSEO = productRootCategory.KeywordSEO;
                }

                if (slugProductCategory != null)
                {
                    var productCategory = await _unitOfWork.ProductCategories.GetProductCategoryDetailByUrlAsync(slugProductCategory);
                    if (productCategory == null) return BaseResponseModel.ReturnError("Không tìm thấy trang");
                    res.ProductCategoryId = productCategory.Id;
                    res.Name = $"Bộ sưu tập {productCategory.Name}";
                    res.Description = productCategory.Description;
                    res.TitleSEO = productCategory.TitleSEO;
                    res.DescriptionSEO = productCategory.DescriptionSEO;
                    res.KeywordSEO = productCategory.KeywordSEO;
                }
                var productRootCategories = await _unitOfWork.ProductRootCategories
                    .Where(c => c.GenderProduct == res.GenderProduct || c.GenderProduct == EnumGenderProduct.All)
                    .OrderBy(x => x.Priority)
                    .ToListAsync();
                res.ProductRootCategories = _mapper.Map<List<StoreProductRootCategoryModel>>(productRootCategories);

                var productCategories = await _unitOfWork.ProductCategories
                    .Where(c => c.GenderProduct == res.GenderProduct || c.GenderProduct == EnumGenderProduct.All)
                    .OrderBy(x => x.Priority)
                    .ToListAsync();
                res.ProductCategories = _mapper.Map<List<StoreProductCategoryModel>>(productCategories);
                _memoryCachingService.SetCache(keyCache, res);
            }

            return BaseResponseModel.ReturnData(res);
        }
    }
}
