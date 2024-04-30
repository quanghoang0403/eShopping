using AutoMapper;
using eShopping.Common.Extensions;
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

namespace eShopping.Application.Features.Products.Queries
{
    public class AdminGetProductsRequest : IRequest<AdminGetProductsResponse>
    {
        public int PageNumber { get; set; }

        public int PageSize { get; set; }

        public string KeySearch { get; set; }

        public Guid? ProductCategoryId { get; set; }

        public EnumStatus Status { get; set; }
        public bool FilterAll { get; set; }

    }

    public class AdminGetProductsResponse
    {
        public IEnumerable<AdminProductDatatableModel> Products { get; set; }

        public int PageNumber { get; set; }

        public int Total { get; set; }
    }

    public class AdminGetProductsRequestHandler : IRequestHandler<AdminGetProductsRequest, AdminGetProductsResponse>
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

        public async Task<AdminGetProductsResponse> Handle(AdminGetProductsRequest request, CancellationToken cancellationToken)
        {
            var loggedUser = await _userProvider.ProvideAsync(cancellationToken);
            var products = _unitOfWork.Products.GetAll();

            if (products != null)
            {
                if (request.ProductCategoryId != null && request.ProductCategoryId != Guid.Empty)
                {
                    /// Find Products by Product categoryId
                    var productIdsInProductCategory = _unitOfWork.ProductInCategories
                        .Find(m => m.ProductCategoryId == request.ProductCategoryId)
                        .Select(m => m.ProductId);

                    products = products.Where(x => productIdsInProductCategory.Contains(x.Id));
                }

                if (!string.IsNullOrEmpty(request.KeySearch))
                {
                    string keySearch = request.KeySearch.Trim().ToLower();
                    products = products.Where(g => g.Name.ToLower().Contains(keySearch));
                }
                if (!request.FilterAll)
                    products = products.Where(p => p.Status == request.Status);
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

            var response = new AdminGetProductsResponse()
            {
                PageNumber = request.PageNumber,
                Total = allProductsInStore.Total,
                Products = productListResponse
            };

            return response;
        }
    }
}
