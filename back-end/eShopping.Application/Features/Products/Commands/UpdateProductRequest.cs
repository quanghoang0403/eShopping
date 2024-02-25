using AutoMapper;
using eShopping.Common.Exceptions;
using eShopping.Common.Helpers;
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

namespace GoFoodBeverage.Application.Features.Products.Commands
{
    public class UpdateProductRequest : IRequest<bool>
    {
        public Guid Id { get; set; }
        public string Name { get; set; }

        public string Content { get; set; }

        public string TitleSEO { get; set; }

        public string DescriptionSEO { get; set; }

        public string Description { get; set; }

        public int ViewCount { set; get; }

        public DateTime DateCreated { set; get; }

        public bool? IsFeatured { get; set; }

        public EnumStatus Status { get; set; }

        public string Thumbnail { get; set; }

        public List<Guid> CategoryIds { get; set; }

        public List<ImageModel> Images { get; set; }

        public List<ProductOptionModel> ProductOptions { get; set; }

    }

    public class EditProductRequestHandler : IRequestHandler<UpdateProductRequest, bool>
    {
        private readonly IMediator _mediator;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IUserProvider _userProvider;
        private readonly IMapper _mapper;


        public EditProductRequestHandler(
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

        public async Task<bool> Handle(UpdateProductRequest request, CancellationToken cancellationToken)
        {
            var loggedUser = await _userProvider.ProvideAsync(cancellationToken);
            RequestValidation(request);

            var productId = request.Id;

            // Check product name duplicate before handle update
            var productNameExisted = await _unitOfWork.Products.GetAll().AnyAsync(p => p.Id != productId && p.Name.Trim().ToLower() == request.Name.Trim().ToLower());
            ThrowError.Against(productNameExisted, "Product name existed");

            // Handle update product
            var updateProductModel = _mapper.Map<Product>(request);
            updateProductModel.LastSavedUser = loggedUser.Id.Value;
            updateProductModel.LastSavedTime = DateTime.UtcNow;
            updateProductModel.UrlSEO = StringHelpers.UrlEncode(updateProductModel.Name);

            var updateProductResult = await _unitOfWork.Products.UpdateProductAsync(updateProductModel, request.CategoryIds);
            ThrowError.Against(updateProductResult == null, "Cannot update this product.");

            return true;
        }

        private static void RequestValidation(UpdateProductRequest request)
        {
            ThrowError.Against(string.IsNullOrEmpty(request.Name), "Please enter product name");
            ThrowError.Against(!request.ProductOptions.Any(), "Please enter product price");
        }
    }
}
