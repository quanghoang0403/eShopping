using AutoMapper;
using eShopping.Common.Extensions;
using eShopping.Common.Models;
using eShopping.Domain.Entities;
using eShopping.Domain.Enums;
using eShopping.Interfaces;
using eShopping.Models.ProductCategories;
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
    public class AdminGetProductsRequest : IRequest<BaseResponseModel>
    {
        public int PageNumber { get; set; }

        public int PageSize { get; set; }

        public string KeySearch { get; set; }

        public Guid? ProductCategoryId { get; set; }

        public Guid? ProductRootCategoryId { get; set; }

        public EnumStatus Status { get; set; }

        public bool FilterAll { get; set; }

        public bool? IsFeatured { get; set; }

        public bool? IsDiscounted { get; set; }

        public bool? IsNewIn { get; set; }

        public bool? IsSoldOut { get; set; }
    }

    public class AdminGetProductsRequestHandler : IRequestHandler<AdminGetProductsRequest, BaseResponseModel>
    {
        private readonly IUserProvider _userProvider;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public AdminGetProductsRequestHandler(
            IUserProvider userProvider,
            IUnitOfWork unitOfWork,
            IMapper mapper)
        {
            _userProvider = userProvider;
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<BaseResponseModel> Handle(AdminGetProductsRequest request, CancellationToken cancellationToken)
        {
            var loggedUser = await _userProvider.ProvideAsync(cancellationToken);
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
                if (!request.FilterAll)
                {
                    products = products.Where(p => p.Status == request.Status);
                }

            }

            var allProductsInStore = await products
                                    .AsNoTracking()
                                    .Include(p => p.ProductPrices.OrderBy(x => x.Priority).ThenBy(pp => pp.CreatedTime))
                                    .OrderByDescending(p => p.CreatedTime)
                                    .ToPaginationAsync(request.PageNumber, request.PageSize);
            var pagingResult = allProductsInStore.Result;
            var productListResponse = _mapper.Map<List<AdminProductDatatableModel>>(pagingResult);
            productListResponse.ForEach(p =>
            {
                var status = pagingResult.Where(pg => pg.Id == p.Id).FirstOrDefault().Status;
                p.No = productListResponse.IndexOf(p) + ((request.PageNumber - 1) * request.PageSize) + 1;
                p.IsActive = Convert.ToBoolean(status.ToInt());
            });

            var response = new PagingResult<AdminProductDatatableModel>(productListResponse, allProductsInStore.Paging);
            return BaseResponseModel.ReturnData(response);
        }
    }
}
