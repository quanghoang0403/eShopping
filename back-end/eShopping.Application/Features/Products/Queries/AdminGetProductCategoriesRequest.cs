using AutoMapper;
using eShopping.Common.Extensions;
using eShopping.Domain.Entities;
using eShopping.Domain.Enums;
using eShopping.Interfaces;
using eShopping.Models.Products;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace eShopping.Application.Features.Products.Queries
{
    public class AdminGetProductCategoriesRequest : IRequest<AdminGetProductCategoriesResponse>
    {
        public int PageNumber { get; set; }

        public int PageSize { get; set; }

        public string KeySearch { get; set; }
    }

    public class AdminGetProductCategoriesResponse
    {
        public IEnumerable<AdminProductCategoryModel> ProductCategories { get; set; }

        public int PageNumber { get; set; }

        public int Total { get; set; }
    }

    public class AdminGetProductCategoriesRequestHandler : IRequestHandler<AdminGetProductCategoriesRequest, AdminGetProductCategoriesResponse>
    {
        private readonly IUserProvider _userProvider;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public AdminGetProductCategoriesRequestHandler(
            IUserProvider userProvider,
            IUnitOfWork unitOfWork,
            IMapper mapper)
        {
            _userProvider = userProvider;
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<AdminGetProductCategoriesResponse> Handle(AdminGetProductCategoriesRequest request, CancellationToken cancellationToken)
        {
            var loggedUser = await _userProvider.ProvideAsync(cancellationToken);
            var allProductCategoriesInStore = new PagingExtensions.Pager<ProductCategory>(new List<ProductCategory>(), 0);
            if (string.IsNullOrEmpty(request.KeySearch))
            {
                allProductCategoriesInStore = await _unitOfWork.ProductCategories
                    .GetAll()
                    .Include(pc => pc.ProductInCategories.Where(pc => pc.Product.Status == EnumStatus.Active))
                    .ThenInclude(ppc => ppc.Product)
                    .OrderByDescending(pc => pc.Priority)
                    .ThenBy(x => x.Name)
                    .ToPaginationAsync(request.PageNumber, request.PageSize);
            }
            else
            {
                string keySearch = request.KeySearch.Trim().ToLower();
                allProductCategoriesInStore = await _unitOfWork.ProductCategories
                   .GetAll()
                   .Where(pc => pc.Name.ToLower().Contains(keySearch))
                   .Include(pc => pc.ProductInCategories.Where(pc => pc.Product.Status == EnumStatus.Active))
                   .ThenInclude(ppc => ppc.Product)
                   .OrderBy(pc => pc.Priority)
                   .ThenBy(x => x.Name)
                   .ToPaginationAsync(request.PageNumber, request.PageSize);
            }

            var listAllProductCategoryInStore = allProductCategoriesInStore.Result;
            var productCategoryListResponse = new List<AdminProductCategoryModel>();
            foreach (var category in listAllProductCategoryInStore)
            {
                productCategoryListResponse.Add(new AdminProductCategoryModel()
                {
                    Id = category.Id,
                    Name = category.Name,
                    Priority = category.Priority,
                    IsShowOnHome = category.IsShowOnHome,
                });
            }
            productCategoryListResponse.ForEach(pc =>
            {
                var productCategory = listAllProductCategoryInStore.FirstOrDefault(i => i.Id == pc.Id);
                var products = productCategory.ProductInCategories.Select(p => p.Product);
                pc.Products = _mapper.Map<IEnumerable<AdminProductDatatableModel>>(products);
            });

            productCategoryListResponse.ForEach(p =>
            {
                p.No = productCategoryListResponse.IndexOf(p) + ((request.PageNumber - 1) * request.PageSize) + 1;
            });

            var response = new AdminGetProductCategoriesResponse()
            {
                PageNumber = request.PageNumber,
                Total = allProductCategoriesInStore.Total,
                ProductCategories = productCategoryListResponse
            };

            return response;
        }
    }
}
