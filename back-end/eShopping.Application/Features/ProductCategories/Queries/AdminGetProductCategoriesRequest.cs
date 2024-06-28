using AutoMapper;
using eShopping.Common.Extensions;
using eShopping.Common.Models;
using eShopping.Domain.Enums;
using eShopping.Interfaces;
using eShopping.Models.ProductCategories;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using static eShopping.Common.Extensions.PagingExtensions;

namespace eShopping.Application.Features.ProductCategories.Queries
{
    public class AdminGetProductCategoriesRequest : IRequest<BaseResponseModel>
    {
        public int PageNumber { get; set; }

        public int PageSize { get; set; }

        public string KeySearch { get; set; }

        public EnumGenderProduct GenderProduct { get; set; }
        public Guid? ProductRootCategoryId { get; set; }
    }

    public class AdminGetProductCategoriesRequestHandler : IRequestHandler<AdminGetProductCategoriesRequest, BaseResponseModel>
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

        public async Task<BaseResponseModel> Handle(AdminGetProductCategoriesRequest request, CancellationToken cancellationToken)
        {
            var loggedUser = await _userProvider.ProvideAsync(cancellationToken);
            var query = _unitOfWork.ProductCategories.GetAll();
            if (!string.IsNullOrEmpty(request.KeySearch))
            {
                string keySearch = request.KeySearch.Trim().ToLower();
                query = query.Where(pc => pc.Name.ToLower().Contains(keySearch));
            }
            if (request.ProductRootCategoryId != null && request.ProductRootCategoryId != Guid.Empty)
            {
                query = query.Where(pc => pc.ProductRootCategoryId == request.ProductRootCategoryId);
            }
            if (request.GenderProduct != EnumGenderProduct.All)
            {
                query = query.Where(pc => pc.GenderProduct == request.GenderProduct || pc.GenderProduct == EnumGenderProduct.All);
            }

            var allProductCategoriesInStore = await query
                   .Include(ppc => ppc.Products)
                   .Include(ppc => ppc.ProductRootCategory)
                   .OrderBy(pc => pc.Priority)
                   .ThenBy(x => x.Name)
                   .ToPaginationAsync(request.PageNumber, request.PageSize);

            var listAllProductCategoryInStore = allProductCategoriesInStore.Result;
            var productCategoryListResponse = new List<AdminProductCategoryModel>();
            foreach (var category in listAllProductCategoryInStore)
            {
                productCategoryListResponse.Add(new AdminProductCategoryModel()
                {
                    Id = category.Id,
                    Name = category.Name,
                    Priority = category.Priority,
                    ProductRootCategoryName = category.ProductRootCategory.Name,
                    Products = _mapper.Map<IEnumerable<AdminProductSelectedModel>>(category.Products),
                    isActive = category.IsActive
                });
            }

            productCategoryListResponse.ForEach(p =>
            {
                p.No = productCategoryListResponse.IndexOf(p) + (request.PageNumber - 1) * request.PageSize + 1;
            });

            var response = new PagingResult<AdminProductCategoryModel>(productCategoryListResponse, allProductCategoriesInStore.Paging);
            return BaseResponseModel.ReturnData(response);
        }
    }
}
