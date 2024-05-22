using AutoMapper;
using eShopping.Common.Helpers;
using eShopping.Common.Models;
using eShopping.Domain.Entities;
using eShopping.Domain.Enums;
using eShopping.Interfaces;
using eShopping.Models.Commons;
using eShopping.Models.Products;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace eShopping.Application.Features.Products.Commands
{
    public class AdminUpdateProductRequest : IRequest<BaseResponseModel>
    {
        public Guid Id { get; set; }
        public string Name { get; set; }

        public string Content { get; set; }

        public string TitleSEO { get; set; }
        public string KeywordSEO { get; set; }

        public string DescriptionSEO { get; set; }

        public string Description { get; set; }

        public int ViewCount { set; get; }

        public DateTime DateCreated { set; get; }

        public bool? IsFeatured { get; set; }

        public EnumStatus Status { get; set; }

        public string Thumbnail { get; set; }

        public List<Guid> ProductCategoryIds { get; set; }

        public List<AdminImageModel> Images { get; set; }

        public List<AdminProductPriceModel> ProductPrices { get; set; }

    }

    public class AdminUpdateProductRequestHandler : IRequestHandler<AdminUpdateProductRequest, BaseResponseModel>
    {
        private readonly IMediator _mediator;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IUserProvider _userProvider;
        private readonly IMapper _mapper;


        public AdminUpdateProductRequestHandler(
            IMediator mediator,
            IUnitOfWork unitOfWork,
            IUserProvider userProvider,
            IMapper mapper
        )
        {
            _mediator = mediator;
            _unitOfWork = unitOfWork;
            _userProvider = userProvider;
            _mapper = mapper;
        }

        public async Task<BaseResponseModel> Handle(AdminUpdateProductRequest request, CancellationToken cancellationToken)
        {
            var loggedUser = await _userProvider.ProvideAsync(cancellationToken);
            if (RequestValidation(request) != null)
            {
                return RequestValidation(request);
            }

            var productId = request.Id;

            // Check product name duplicate before handle update
            var productNameExisted = await _unitOfWork.Products.GetAll().AnyAsync(p => p.Id != productId && p.Name.Trim().ToLower() == request.Name.Trim().ToLower());
            if (productNameExisted != false)
            {
                return BaseResponseModel.ReturnError("Product name existed");
            }
            // Handle update product
            var updateProductModel = _mapper.Map<Product>(request);
            updateProductModel.LastSavedUser = loggedUser.AccountId.Value;
            updateProductModel.LastSavedTime = DateTime.Now;
            updateProductModel.UrlSEO = StringHelpers.UrlEncode(updateProductModel.Name);

            var updateProductResult = await _unitOfWork.Products.UpdateProductAsync(updateProductModel, request.ProductCategoryIds);
            if (updateProductResult == null)
            {
                return BaseResponseModel.ReturnError("Cannot update this product.");
            }
            return BaseResponseModel.ReturnData();
        }

        private static BaseResponseModel RequestValidation(AdminUpdateProductRequest request)
        {
            if (string.IsNullOrEmpty(request.Name))
            {
                return BaseResponseModel.ReturnError("Please enter product name");
            }
            else if (!request.ProductPrices.Any())
            {
                return BaseResponseModel.ReturnError("Please enter product price");
            }
            else if (request.ProductPrices.Any(p => string.IsNullOrEmpty(p.PriceName)))
            {
                return BaseResponseModel.ReturnError("Please enter product price name");
            }
            else if (request.ProductPrices.Any(p => p.PriceValue <= 0))
            {
                return BaseResponseModel.ReturnError("Price value must greater than 0");
            }
            else if (request.ProductPrices.Any(p => p.PriceOriginal <= 0))
            {
                return BaseResponseModel.ReturnError("Price original must greater than 0");
            }
            else if (request.ProductPrices.Any(p => p.PriceOriginal > p.PriceValue))
            {
                return BaseResponseModel.ReturnError("PriceOriginal must less than PriceValue");
            }
            else
            {
                return null;
            }

        }
    }
}
