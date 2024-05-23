using AutoMapper;
using eShopping.Common.Extensions;
using eShopping.Common.Helpers;
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

        public Guid? ProductCategoryId { get; set; }

        public Guid? ProductRootCategoryId { get; set; }

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
                if (request.ProductRootCategoryId != null && request.ProductRootCategoryId != Guid.Empty)
                {
                    products = products.Where(x => x.ProductRootCategoryId == request.ProductRootCategoryId);
                }

                if (request.ProductCategoryId != null && request.ProductCategoryId != Guid.Empty)
                {
                    products = products.Where(x => x.ProductCategoryId == request.ProductCategoryId);
                }

                if (!string.IsNullOrEmpty(request.KeySearch))
                {
                    string keySearch = request.KeySearch.Trim().ToLower();
                    products = products.Where(g => g.Name.ToLower().Contains(keySearch));
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
                    products = products.Where(g => g.IsDiscounted == true).Include(x => x.ProductPrices).Where(x => x.ProductPrices.Any(p => p.EndDate <= DateTime.Now));
                }

                products = products.Include(p => p.ProductPrices.OrderBy(x => x.Priority).ThenBy(pp => pp.CreatedTime));
                if (request.SortType == EnumSortType.Default)
                {
                    products = products.OrderByDescending(p => p.CreatedTime);
                }
                else if (request.SortType == EnumSortType.PriceAsc)
                {
                    products = products.OrderBy(p => p.ProductPrices.FirstOrDefault().PriceDiscount ?? p.ProductPrices.FirstOrDefault().PriceValue);
                }
                else if (request.SortType == EnumSortType.PriceDesc)
                {
                    products = products.OrderByDescending(p => p.ProductPrices.FirstOrDefault().PriceDiscount ?? p.ProductPrices.FirstOrDefault().PriceValue);
                }
            }
            var allProducts = await products.AsNoTracking().ToPaginationAsync(request.PageNumber, request.PageSize);
            var pagingResult = allProducts.Result;
            var productListResponse = new List<StoreProductModel>();
            foreach (var product in pagingResult)
            {
                var defaultPrice = product.ProductPrices.FirstOrDefault();
                var productResponse = _mapper.Map<StoreProductModel>(product);
                productResponse.PriceValue = defaultPrice.PriceValue;
                if (defaultPrice.PriceDiscount > 0)
                {
                    productResponse.PriceDiscount = defaultPrice.PriceDiscount;
                    productResponse.PercentNumber = defaultPrice.PercentNumber;
                }
                productListResponse.Add(productResponse);
            }

            var response = new PagingResult<StoreProductModel>(productListResponse, allProducts.Paging);
            return BaseResponseModel.ReturnData(response);

        }
    }
}
