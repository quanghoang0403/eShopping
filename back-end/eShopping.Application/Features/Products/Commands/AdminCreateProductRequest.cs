using AutoMapper;
using eShopping.Common.Helpers;
using eShopping.Common.Models;
using eShopping.Domain.Entities;
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

namespace eShopping.Application.Features.Products.Commands
{
    public class AdminCreateProductRequest : IRequest<BaseResponseModel>
    {
        public string Name { get; set; }

        public string Content { get; set; }

        public string TitleSEO { get; set; }
        public string KeywordSEO { get; set; }

        public string DescriptionSEO { get; set; }

        public string Description { get; set; }

        public int ViewCount { set; get; }

        public DateTime DateCreated { set; get; }

        public bool? IsFeatured { get; set; }

        public Guid ProductCategoryId { get; set; }

        public Guid ProductRootCategoryId { get; set; }

        public List<string> ImagePaths { get; set; }

        public string Thumbnail { get; set; }

        public List<AdminProductPriceModel> ProductPrices { get; set; }
    }

    public class AdminCreateMaterialRequestHandler : IRequestHandler<AdminCreateProductRequest, BaseResponseModel>
    {
        private readonly IMediator _mediator;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IUserProvider _userProvider;
        private readonly IMapper _mapper;

        public AdminCreateMaterialRequestHandler(
            IMediator mediator,
            IUnitOfWork unitOfWork,
            IUserProvider userProvider,
            IMapper mapper)
        {
            _mediator = mediator;
            _unitOfWork = unitOfWork;
            _userProvider = userProvider;
            _mapper = mapper;
        }

        public async Task<BaseResponseModel> Handle(AdminCreateProductRequest request, CancellationToken cancellationToken)
        {
            var loggedUser = await _userProvider.ProvideAsync(cancellationToken);

            #region Validate

            if (string.IsNullOrEmpty(request.Name))
                return BaseResponseModel.ReturnError("Please enter product name");

            if (request.ProductPrices == null || !request.ProductPrices.Any())
                return BaseResponseModel.ReturnError("Please enter product price");

            if (request.ProductPrices.Any(p => string.IsNullOrEmpty(p.PriceName)))
                return BaseResponseModel.ReturnError("Please enter price name");

            if (request.ProductPrices.Any(p => p.PriceValue <= 0))
                return BaseResponseModel.ReturnError("Please enter price value");

            if (request.ProductPrices.Any(p => p.PriceOriginal <= 0))
                return BaseResponseModel.ReturnError("Please enter price original");

            if (request.ProductPrices.Any(p => p.PriceOriginal > p.PriceValue))
                return BaseResponseModel.ReturnError("Price original must less than price value");

            #endregion

            // Check valid image
            // TO DO

            // Add product
            var product = _mapper.Map<Product>(request);
            var accountId = loggedUser.AccountId.Value;
            product.Status = EnumStatus.Active;
            product.CreatedUser = accountId;
            product.CreatedTime = DateTime.Now;
            product.UrlSEO = StringHelpers.UrlEncode(product.Name);

            if (request.ProductPrices.Any(pc => pc.PercentNumber > 0 || pc.PriceDiscount > 0))
            {
                product.IsDiscounted = true;
            }
            else
            {
                product.IsDiscounted = false;
            }

            return await _unitOfWork.CreateExecutionStrategy().ExecuteAsync(async () =>
            {
                // Create a new transaction to save data more securely, data will be restored if an error occurs.
                using var createTransaction = await _unitOfWork.BeginTransactionAsync();
                try
                {
                    await _unitOfWork.Products.AddAsync(product);

                    // Add image
                    List<Image> productImages = new();
                    foreach (var path in request.ImagePaths)
                    {
                        Image image = new()
                        {
                            ObjectId = product.Id,
                            ImagePath = path,
                            CreatedUser = accountId,
                            CreatedTime = DateTime.Now
                        };
                        productImages.Add(image);
                    }
                    await _unitOfWork.Images.AddRangeAsync(productImages);

                    // Add option
                    //List<ProductPrice> productPrices = new();
                    //foreach (var option in request.ProductPrices)
                    //{
                    //    var optionToAdd = _mapper.Map<ProductPrice>(option);
                    //    optionToAdd.ProductId = product.Id;
                    //    optionToAdd.CreatedUser = accountId;
                    //    optionToAdd.CreatedTime = DateTime.Now;
                    //    productPrices.Add(optionToAdd);
                    //}
                    //await _unitOfWork.ProductPrices.AddRangeAsync(productPrices);
                    // Complete this transaction, data will be saved.
                    await createTransaction.CommitAsync(cancellationToken);

                }
                catch (Exception ex)
                {
                    // Data will be restored.
                    await createTransaction.RollbackAsync(cancellationToken);
                    BaseResponseModel.ReturnError(ex.Message, "Can not create Product");
                }

                return BaseResponseModel.ReturnData();
            });
        }
    }
}
