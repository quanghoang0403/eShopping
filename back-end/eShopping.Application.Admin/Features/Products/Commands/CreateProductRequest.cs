using eShopping.Common.Exceptions;
using eShopping.Domain.Entities;
using eShopping.Domain.Enums;
using eShopping.Interfaces;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace eShopping.Application.Admin.Features.Products.Commands
{
    public class CreateProductRequest : IRequest<bool>
    {
        public string Title { get; set; }

        public string Content { get; set; }

        public string UrlSEO { get; set; }

        public string TitleSEO { get; set; }

        public string DescriptionSEO { get; set; }

        public string Description { get; set; }

        public int ViewCount { set; get; }

        public DateTime DateCreated { set; get; }

        public bool? IsFeatured { get; set; }

        public EnumStatus Status { get; set; }

        public List<Guid> CategoryIds { get; set; }

        public List<string> ImagePaths { get; set; }

        public List<ProductOptionModel> ProductOptions { get; set; }
    }

    public class ProductOptionModel
    {
        public string Name { get; set; }

        public decimal Price { set; get; }
    }

    public class CreateMaterialRequestHandler : IRequestHandler<CreateProductRequest, bool>
    {
        private readonly IMediator _mediator;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IUserProvider _userProvider;

        public CreateMaterialRequestHandler(
            IMediator mediator,
            IUnitOfWork unitOfWork,
            IUserProvider userProvider)
        {
            _mediator = mediator;
            _unitOfWork = unitOfWork;
            _userProvider = userProvider;
        }

        public async Task<bool> Handle(CreateProductRequest request, CancellationToken cancellationToken)
        {
            var loggedUser = await _userProvider.ProvideAsync(cancellationToken);

            RequestValidation(request);

            // Check valid image
            // TO DO

            // Add product
            var accountId = loggedUser.AccountId.Value;
            var product = new Product()
            {
                Title = request.Title,
                Content = request.Content,
                UrlSEO = request.UrlSEO,
                TitleSEO = request.Content,
                DescriptionSEO = request.DescriptionSEO,
                Description = request.Description,
                ViewCount = 0,
                IsFeatured = false,
                CreatedUser = accountId,
                LastSavedUser = accountId,
                LastSavedTime = DateTime.UtcNow
            };
            await _unitOfWork.Products.AddAsync(product);

            // Add map category
            List<ProductInCategory> productInCategories = new();
            foreach (var id in request.CategoryIds)
            {
                ProductInCategory map = new()
                {
                    CategoryId = id,
                    ProductId = product.Id
                };
                productInCategories.Add(map);
            }
            await _unitOfWork.ProductInCategories.AddRangeAsync(productInCategories);

            // Add image
            List<Image> productImages = new();
            foreach (var path in request.ImagePaths)
            {
                Image image = new()
                {
                    ObjectId = product.Id,
                    ImagePath = path,
                    CreatedUser = accountId,
                    LastSavedUser = accountId,
                    LastSavedTime = DateTime.UtcNow
                };
                productImages.Add(image);
            }
            await _unitOfWork.Images.AddRangeAsync(productImages);

            // Add option
            List<ProductOption> productOptions = new();
            foreach (var option in request.ProductOptions)
            {
                ProductOption optionToAdd = new()
                {
                    ProductId = product.Id,
                    Name = option.Name,
                    Price = option.Price,
                    QuantityLeft = 0,
                    QuantitySold = 0,
                    CreatedUser = accountId,
                    LastSavedUser = accountId,
                    LastSavedTime = DateTime.UtcNow
                };
                productOptions.Add(optionToAdd);
            }
            await _unitOfWork.ProductOptions.AddRangeAsync(productOptions);

            return true;
        }

        private static void RequestValidation(CreateProductRequest request)
        {
            ThrowError.Against(string.IsNullOrEmpty(request.Title), "Please enter product name");
            ThrowError.Against(request.ProductOptions != null && !request.ProductOptions.Any(), "Please enter product option");
            ThrowError.Against(string.IsNullOrEmpty((request.ProductOptions.FirstOrDefault().Name)), "Please enter product option name");
            ThrowError.Against(request.ProductOptions.FirstOrDefault().Price <= 0, "Please enter product option price");
        }
    }
}
