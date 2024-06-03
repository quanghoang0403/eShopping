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

        public EnumGenderProduct GenderProduct { get; set; }

        public bool? IsFeatured { get; set; }

        public Guid ProductCategoryId { get; set; }

        public Guid ProductRootCategoryId { get; set; }

        public Guid ProductSizeCategoryId { get; set; }

        public List<string> Gallery { get; set; }

        public string Thumbnail { get; set; }

        public decimal PriceOriginal { set; get; }

        public decimal PriceValue { set; get; }

        public decimal? PriceDiscount { set; get; }

        public float? PercentNumber { get; set; }

        public DateTime StartDate { get; set; }

        public DateTime? EndDate { get; set; }

        public List<AdminProductVariantWithStockModel> ProductVariants { get; set; }
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

            if (request.ProductVariants == null || !request.ProductVariants.Any())
                return BaseResponseModel.ReturnError("Please enter product price");

            if (request.ProductVariants.Any(p => string.IsNullOrEmpty(p.Name)))
                return BaseResponseModel.ReturnError("Please enter price name");

            if (request.ProductVariants.Any(p => p.PriceValue <= 0))
                return BaseResponseModel.ReturnError("Please enter price value");

            if (request.ProductVariants.Any(p => p.PriceOriginal <= 0))
                return BaseResponseModel.ReturnError("Please enter price original");

            if (request.ProductVariants.Any(p => p.PriceOriginal > p.PriceValue))
                return BaseResponseModel.ReturnError("Price original must less than price value");

            #endregion

            // Add product
            var product = _mapper.Map<Product>(request);
            var accountId = loggedUser.AccountId.Value;
            product.Status = EnumStatus.Active;
            product.CreatedUser = accountId;
            product.CreatedTime = DateTime.Now;
            product.UrlSEO = StringHelpers.UrlEncode(product.Name);

            return await _unitOfWork.CreateExecutionStrategy().ExecuteAsync(async () =>
            {
                // Create a new transaction to save data more securely, data will be restored if an error occurs.
                using var createTransaction = await _unitOfWork.BeginTransactionAsync();
                try
                {
                    await _unitOfWork.Products.AddAsync(product);

                    // Add image
                    var productImages = request.Gallery.Select(x => new Image()
                    {
                        ObjectId = product.Id,
                        ImagePath = x,
                        CreatedUser = accountId,
                        CreatedTime = DateTime.Now
                    });
                    await _unitOfWork.Images.AddRangeAsync(productImages);

                    // Add stock
                    var stocksToAdd = new List<ProductStock>();
                    foreach (var variant in product.ProductVariants)
                    {
                        var variantAdd = request.ProductVariants.Where(x => x.Priority == variant.Priority).FirstOrDefault();
                        foreach (var stock in variantAdd.Stocks)
                        {
                            stocksToAdd.Add(new ProductStock
                            {
                                ProductId = product.Id,
                                ProductVariantId = variant.Id,
                                ProductSizeId = stock.ProductSizeId,
                                QuantityLeft = stock.QuantityLeft
                            });
                        }
                    }
                    await _unitOfWork.ProductStocks.AddRangeAsync(stocksToAdd);

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
