﻿using AutoMapper;
using eShopping.Common.Exceptions;
using eShopping.Interfaces;
using GoFoodBeverage.Models.Product;
using MediatR;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace GoFoodBeverage.Application.Features.Products.Queries
{
    public class GetProductCategoryByIdRequest : IRequest<GetProductCategoryByIdResponse>
    {
        public Guid? Id { get; set; }
    }

    public class GetProductCategoryByIdResponse
    {
        public bool IsSuccess { get; set; }

        public ProductCategoryDetailModel ProductCategory { get; set; }
    }

    public class GetProductCategoryByIdRequestHandler : IRequestHandler<GetProductCategoryByIdRequest, GetProductCategoryByIdResponse>
    {
        private readonly IUserProvider _userProvider;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public GetProductCategoryByIdRequestHandler(IUserProvider userProvider, IUnitOfWork unitOfWork, IMapper mapper)
        {
            _userProvider = userProvider;
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<GetProductCategoryByIdResponse> Handle(GetProductCategoryByIdRequest request, CancellationToken cancellationToken)
        {
            var loggedUser = await _userProvider.ProvideAsync(cancellationToken);

            var productCategoryData = await _unitOfWork.Categories.GetCategoryDetailByIdAsync(request.Id.Value);
            ThrowError.Against(productCategoryData == null, "Cannot find product category information");

            var productCategory = _mapper.Map<ProductCategoryDetailModel>(productCategoryData);
            productCategory.Products = productCategoryData.ProductInCategories
                .Select(x => new ProductCategoryDetailModel.ProductSelectedModel
                {
                    Id = x.ProductId,
                    Name = x.Product.Name,
                    SortOrder = x.Product.SortOrder,
                    Thumbnail = x.Product?.Thumbnail,
                })
                .OrderBy(x => x.Position)
                .ToList();

            productCategory.StoreBranchIds = productCategoryData.StoreBranchProductCategories
               .Select(x => x.StoreBranchId)
               .ToList();

            return new GetProductCategoryByIdResponse
            {
                IsSuccess = true,
                ProductCategory = productCategory
            };
        }
    }
}
