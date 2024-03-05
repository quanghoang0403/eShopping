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
    public class GetProductsByFilterRequest : IRequest<GetProductsByFilterResponse>
    {
        public int PageNumber { get; set; }

        public int PageSize { get; set; }

        public string KeySearch { get; set; }

        public Guid? CategoryId { get; set; }

        public EnumStatus Status { get; set; }

    }

    public class GetProductsByFilterResponse
    {
        public IEnumerable<ProductDatatableModel> Products { get; set; }

        public int PageNumber { get; set; }

        public int Total { get; set; }
    }

    public class GetProductsByFilterRequestHandler : IRequestHandler<GetProductsByFilterRequest, GetProductsByFilterResponse>
    {
        private readonly IUserProvider _userProvider;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public GetProductsByFilterRequestHandler(
            IUserProvider userProvider,
            IUnitOfWork unitOfWork,
            IMapper mapper)
        {
            _userProvider = userProvider;
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<GetProductsByFilterResponse> Handle(GetProductsByFilterRequest request, CancellationToken cancellationToken)
        {
            var loggedUser = await _userProvider.ProvideAsync(cancellationToken);
            var products = _unitOfWork.Products.GetAll();

            if (products != null)
            {
                if (request.CategoryId != null)
                {
                    /// Find Products by Product categoryId
                    var productIdsInProductCategory = _unitOfWork.ProductInCategories
                        .Find(m => m.CategoryId == request.CategoryId)
                        .Select(m => m.ProductId);

                    products = products.Where(x => productIdsInProductCategory.Contains(x.Id));
                }

                if (!string.IsNullOrEmpty(request.KeySearch))
                {
                    string keySearch = request.KeySearch.Trim().ToLower();
                    products = products.Where(g => g.Name.ToLower().Contains(keySearch));
                }
            }

            var allProductsInStore = await products
                                    .AsNoTracking()
                                    .Include(p => p.ProductOptions.OrderBy(x => x.Priority).ThenBy(pp => pp.CreatedTime))
                                    .OrderByDescending(p => p.CreatedTime)
                                    .ToPaginationAsync(request.PageNumber, request.PageSize);
            var pagingResult = allProductsInStore.Result;
            var productListResponse = _mapper.Map<List<ProductDatatableModel>>(pagingResult);
            productListResponse.ForEach(p =>
            {
                p.No = productListResponse.IndexOf(p) + ((request.PageNumber - 1) * request.PageSize) + 1;
            });

            var response = new GetProductsByFilterResponse()
            {
                PageNumber = request.PageNumber,
                Total = allProductsInStore.Total,
                Products = productListResponse
            };

            return response;
        }
    }
}
