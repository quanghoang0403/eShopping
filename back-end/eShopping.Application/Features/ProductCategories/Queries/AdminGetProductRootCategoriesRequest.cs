﻿using AutoMapper;
using eShopping.Common.Extensions;
using eShopping.Common.Models;
using eShopping.Domain.Enums;
using eShopping.Interfaces;
using eShopping.Models.ProductCategories;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using static eShopping.Common.Extensions.PagingExtensions;

namespace eShopping.Application.Features.ProductCategories.Queries
{
    public class AdminGetProductRootCategoriesRequest : IRequest<BaseResponseModel>
    {
        public int PageNumber { get; set; }

        public int PageSize { get; set; }

        public string KeySearch { get; set; }

        public EnumGenderProduct GenderProduct { get; set; }
    }

    public class AdminGetProductRootCategoriesRequestHandler : IRequestHandler<AdminGetProductRootCategoriesRequest, BaseResponseModel>
    {
        private readonly IUserProvider _userProvider;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public AdminGetProductRootCategoriesRequestHandler(
            IUserProvider userProvider,
            IUnitOfWork unitOfWork,
            IMapper mapper)
        {
            _userProvider = userProvider;
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<BaseResponseModel> Handle(AdminGetProductRootCategoriesRequest request, CancellationToken cancellationToken)
        {
            var loggedUser = await _userProvider.ProvideAsync(cancellationToken);
            var query = _unitOfWork.ProductRootCategories.GetAll();
            if (request.GenderProduct != EnumGenderProduct.All)
            {
                query = query.Where(pc => pc.GenderProduct == request.GenderProduct || pc.GenderProduct == EnumGenderProduct.All);
            }

            if (!string.IsNullOrEmpty(request.KeySearch))
            {
                string keySearch = request.KeySearch.Trim().ToLower();
                query = query.Where(pc => pc.Name.ToLower().Contains(keySearch));
            }
            if (request.GenderProduct != EnumGenderProduct.All)
            {
                query = query.Where(pc => pc.GenderProduct == request.GenderProduct || pc.GenderProduct == EnumGenderProduct.All);
            }
            var allProductRootCategoriesInStore = await query.AsNoTracking()
                   .Include(ppc => ppc.Products)
                   .Include(ppc => ppc.ProductCategories)
                   .OrderBy(pc => pc.Priority)
                   .ThenBy(x => x.Name)
                   .ToPaginationAsync(request.PageNumber, request.PageSize);

            var listAllProductRootCategoryInStore = allProductRootCategoriesInStore.Result;
            var ProductRootCategoryListResponse = new List<AdminProductRootCategoryModel>();
            foreach (var category in listAllProductRootCategoryInStore)
            {
                ProductRootCategoryListResponse.Add(new AdminProductRootCategoryModel()
                {
                    Id = category.Id,
                    Name = category.Name,
                    Priority = category.Priority,
                    GenderProduct = category.GenderProduct,
                    IsActive = category.IsActive,
                    Products = _mapper.Map<IEnumerable<AdminProductSelectedModel>>(category.Products.OrderBy(x => x.Priority)),
                    ProductCategories = _mapper.Map<IEnumerable<AdminProductCategorySelectedModel>>(category.ProductCategories.OrderBy(x => x.Priority))
                });
            }

            ProductRootCategoryListResponse.ForEach(p =>
            {
                p.No = ProductRootCategoryListResponse.IndexOf(p) + (request.PageNumber - 1) * request.PageSize + 1;
            });

            var response = new PagingResult<AdminProductRootCategoryModel>(ProductRootCategoryListResponse, allProductRootCategoriesInStore.Paging);
            return BaseResponseModel.ReturnData(response);
        }
    }
}
