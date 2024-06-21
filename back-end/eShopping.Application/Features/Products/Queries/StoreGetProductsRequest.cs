using AutoMapper;
using eShopping.Common.Extensions;
using eShopping.Common.Models;
using eShopping.Domain.Enums;
using eShopping.Interfaces;
using eShopping.Models.Products;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using static eShopping.Common.Extensions.PagingExtensions;

namespace eShopping.Application.Features.Products.Queries
{
    public class StoreGetProductsRequest : IRequest<BaseResponseModel>
    {
        public int PageNumber { get; set; }

        public int PageSize { get; set; }

        public string KeySearch { get; set; }

        public EnumGenderProduct GenderProduct { get; set; }

        public List<Guid> ProductCategoryIds { get; set; }

        public List<Guid> ProductRootCategoryIds { get; set; }

        public bool? IsFeatured { get; set; }

        public bool? IsDiscounted { get; set; }

        public bool? IsNewIn { get; set; }

        public bool? IsSoldOut { get; set; }

        public EnumSortType SortType { get; set; }

    }

    public class StoreGetProductsRequestHandler : IRequestHandler<StoreGetProductsRequest, BaseResponseModel>
    {
        private readonly IUserProvider _userProvider;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public StoreGetProductsRequestHandler(
            IUserProvider userProvider,
            IUnitOfWork unitOfWork,
            IMapper mapper)
        {
            _userProvider = userProvider;
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<BaseResponseModel> Handle(StoreGetProductsRequest request, CancellationToken cancellationToken)
        {
            var products = _unitOfWork.Products.GetAll();

            if (products != null)
            {
                if (request.GenderProduct != EnumGenderProduct.All)
                {
                    products = products.Where(x => request.GenderProduct == x.GenderProduct || x.GenderProduct == EnumGenderProduct.All);
                }

                if (request.ProductRootCategoryIds != null && request.ProductRootCategoryIds.Count > 0)
                {
                    products = products.Where(x => request.ProductRootCategoryIds.Contains(x.ProductRootCategoryId));
                }

                if (request.ProductCategoryIds != null && request.ProductCategoryIds.Count > 0)
                {
                    products = products.Where(x => request.ProductCategoryIds.Contains(x.ProductCategoryId));
                }

                if (!string.IsNullOrEmpty(request.KeySearch))
                {
                    string keySearch = request.KeySearch.Trim().ToLower();
                    products = products.Where(g => g.Name.ToLower().Contains(keySearch));
                }

                if (request.IsSoldOut == true)
                {
                    products = products.Where(g => g.IsSoldOut == true);
                }

                if (request.IsNewIn == true)
                {
                    products = products.Where(g => g.IsNewIn == true);
                }

                if (request.IsFeatured == true)
                {
                    products = products.Where(g => g.IsFeatured == true);
                }

                if (request.IsDiscounted == true)
                {
                    products = products.Where(g => g.IsDiscounted == true);
                }

                products = products.Include(p => p.ProductVariants.OrderBy(x => x.Priority).ThenBy(pp => pp.CreatedTime));
                if (request.SortType == EnumSortType.Default)
                {
                    products = products.OrderByDescending(p => p.CreatedTime);
                }
                else if (request.SortType == EnumSortType.PriceAsc)
                {
                    products = products.OrderBy(p => p.ProductVariants.FirstOrDefault().PriceDiscount ?? p.ProductVariants.FirstOrDefault().PriceValue);
                }
                else if (request.SortType == EnumSortType.PriceDesc)
                {
                    products = products.OrderByDescending(p => p.ProductVariants.FirstOrDefault().PriceDiscount ?? p.ProductVariants.FirstOrDefault().PriceValue);
                }
            }
            var allProducts = await products
                .Include(x => x.ProductVariants)
                .Include(p => p.ProductCategory)
                .Include(p => p.ProductRootCategory)
                .Include(p => p.ProductSizeCategory.ProductSizes)
                .Include(p => p.ProductStocks)
                .AsNoTracking()
                .OrderBy(p => p.Priority)
                .ToPaginationAsync(request.PageNumber, request.PageSize);
            var pagingResult = allProducts.Result;
            var productResponse = _mapper.Map<List<StoreProductModel>>(pagingResult);
            var response = new PagingResult<StoreProductModel>(productResponse, allProducts.Paging);
            return BaseResponseModel.ReturnData(response);

        }
    }
}
