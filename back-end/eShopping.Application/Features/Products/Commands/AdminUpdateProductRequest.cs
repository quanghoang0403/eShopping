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

        public bool IsActive { get; set; }

        public EnumGenderProduct GenderProduct { get; set; }

        public string Thumbnail { get; set; }

        public Guid ProductCategoryId { get; set; }

        public Guid ProductRootCategoryId { get; set; }

        public Guid ProductSizeCategoryId { get; set; }

        public List<string> Gallery { get; set; }

        public decimal PriceOriginal { set; get; }

        public decimal PriceValue { set; get; }

        public decimal? PriceDiscount { set; get; }

        public float? PercentNumber { get; set; }

        public DateTime? StartDate { get; set; }

        public DateTime? EndDate { get; set; }

        public List<AdminProductVariantWithStockModel> ProductVariants { get; set; }

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
            var productNameExisted = await _unitOfWork.Products.GetAll().AnyAsync(p => p.Id != productId && p.Name.Trim().ToLower() == request.Name.Trim().ToLower(), cancellationToken: cancellationToken);
            if (productNameExisted == true)
            {
                return BaseResponseModel.ReturnError("Product name existed");
            }

            return await _unitOfWork.CreateExecutionStrategy().ExecuteAsync(async () =>
            {
                // Create a new transaction to save data more securely, data will be restored if an error occurs.
                using var createTransaction = await _unitOfWork.BeginTransactionAsync();
                try
                {
                    // Remove old gallery
                    var oldGallery = await _unitOfWork.Images
                        .Where(i => i.ObjectId == request.Id && i.ImageType == EnumImageTypeObject.Product)
                        .ToListAsync();
                    _unitOfWork.Images.RemoveRange(oldGallery);

                    // Remove old product stocks
                    var oldProductStocks = await _unitOfWork.ProductStocks
                        .Where(x => x.ProductId == request.Id)
                        .ToListAsync(cancellationToken: cancellationToken);
                    _unitOfWork.ProductStocks.RemoveRange(oldProductStocks);

                    // Remove old product variants
                    var oldProductVariants = await _unitOfWork.ProductVariants
                        .Where(x => x.ProductId == request.Id)
                        .ToListAsync(cancellationToken: cancellationToken);
                    _unitOfWork.ProductVariants.RemoveRange(oldProductVariants);

                    // Update gallery
                    var productImages = request.Gallery?.Select(x => new Image()
                    {
                        ObjectId = productId,
                        ImagePath = x,
                        CreatedUser = loggedUser.AccountId.Value,
                        CreatedTime = DateTime.Now
                    });
                    await _unitOfWork.Images.AddRangeAsync(productImages);

                    // Update product variants
                    var newProductVariants = request.ProductVariants.Select(x => new ProductVariant()
                    {
                        Priority = x.Priority,
                        Name = x.Name,
                        ProductId = productId,
                        StartDate = x.StartDate,
                        EndDate = x.EndDate,
                        PriceOriginal = x.PriceOriginal,
                        PriceValue = x.PriceValue,
                        PriceDiscount = x.PriceDiscount,
                        PercentNumber = x.PercentNumber,
                        IsUseBasePrice = x.IsUseBasePrice ?? false,
                        Thumbnail = x.Thumbnail
                    }).ToList();
                    await _unitOfWork.ProductVariants.AddRangeAsync(newProductVariants);

                    // Update product stocks
                    var newProductStocks = new List<ProductStock>();
                    foreach (var variant in newProductVariants)
                    {
                        var variantAdd = request.ProductVariants.Where(x => x.Priority == variant.Priority).FirstOrDefault();
                        foreach (var stock in variantAdd.Stocks)
                        {
                            newProductStocks.Add(new ProductStock
                            {
                                ProductId = productId,
                                ProductVariantId = variant.Id,
                                ProductVariantName = variant.Name,
                                ProductSizeId = stock.ProductSizeId,
                                ProductSizeName = stock.ProductSizeName,
                                QuantityLeft = stock.QuantityLeft
                            });
                        }
                    }
                    await _unitOfWork.ProductStocks.AddRangeAsync(newProductStocks);

                    // Handle update product
                    var updateProductModel = _mapper.Map<Product>(request);
                    updateProductModel.LastSavedUser = loggedUser.AccountId.Value;
                    updateProductModel.LastSavedTime = DateTime.Now;
                    updateProductModel.UrlSEO = StringHelpers.UrlEncode(updateProductModel.Name);
                    updateProductModel.ProductVariants = newProductVariants;
                    updateProductModel.ProductStocks = newProductStocks;
                    await _unitOfWork.Products.UpdateAsync(updateProductModel);

                    await createTransaction.CommitAsync(cancellationToken);

                }
                catch (Exception ex)
                {
                    // Data will be restored.
                    await createTransaction.RollbackAsync(cancellationToken);
                    return BaseResponseModel.ReturnError("Can not update product", ex.Message);
                }

                return BaseResponseModel.ReturnData();
            });
        }

        private static BaseResponseModel RequestValidation(AdminUpdateProductRequest request)
        {
            if (string.IsNullOrEmpty(request.Name))
            {
                return BaseResponseModel.ReturnError("Please enter product name");
            }
            else if (!request.ProductVariants.Any())
            {
                return BaseResponseModel.ReturnError("Please enter product price");
            }
            else if (request.ProductVariants.Any(p => string.IsNullOrEmpty(p.Name)))
            {
                return BaseResponseModel.ReturnError("Please enter product price name");
            }
            else if (request.ProductVariants.Any(p => p.PriceValue <= 0))
            {
                return BaseResponseModel.ReturnError("Price value must greater than 0");
            }
            else if (request.ProductVariants.Any(p => p.PriceOriginal <= 0))
            {
                return BaseResponseModel.ReturnError("Price original must greater than 0");
            }
            else if (request.ProductVariants.Any(p => p.PriceOriginal > p.PriceValue))
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
