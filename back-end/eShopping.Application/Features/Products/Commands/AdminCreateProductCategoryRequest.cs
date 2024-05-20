using AutoMapper;
using eShopping.Common.Helpers;
using eShopping.Common.Models;
using eShopping.Domain.Entities;
using eShopping.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace eShopping.Application.Features.Products.Commands
{
    public class AdminCreateProductCategoryRequest : IRequest<BaseResponseModel>
    {

        public string Name { get; set; }

        public int Priority { get; set; }

        public string Content { get; set; }

        public string KeywordSEO { get; set; }

        public string TitleSEO { get; set; }

        public string DescriptionSEO { get; set; }

        public string Description { get; set; }

        public bool IsShowOnHome { set; get; }


        public List<ProductSelectedModel> Products { get; set; }
    }

    public class ProductSelectedModel
    {
        public Guid Id { get; set; }

        public int Position { get; set; }
    }

    public class AdminCreateProductCategoryRequestHandler : IRequestHandler<AdminCreateProductCategoryRequest, BaseResponseModel>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IUserProvider _userProvider;
        private readonly IMapper _mapper;

        public AdminCreateProductCategoryRequestHandler(
            IUnitOfWork unitOfWork,
            IUserProvider userProvider,
            IMapper mapper
        )
        {
            _unitOfWork = unitOfWork;
            _userProvider = userProvider;
            _mapper = mapper;
        }

        public async Task<BaseResponseModel> Handle(AdminCreateProductCategoryRequest request, CancellationToken cancellationToken)
        {
            var loggedUser = await _userProvider.ProvideAsync(cancellationToken);
            if (RequestValidation(request) != null)
            {
                return RequestValidation(request);
            }


            var productCategoryNameExisted = await _unitOfWork.ProductCategories.GetProductCategoryDetailByNameAsync(request.Name);
            if (productCategoryNameExisted != null)
            {
                return BaseResponseModel.ReturnError("Product category name has already existed");
            }

            return await _unitOfWork.CreateExecutionStrategy().ExecuteAsync(async () =>
            {
                // Create a new transaction to save data more securely, data will be restored if an error occurs.
                using var createTransaction = await _unitOfWork.BeginTransactionAsync();
                try
                {
                    var newProductCategory = _mapper.Map<ProductCategory>(request);
                    var accountId = loggedUser.AccountId.Value;
                    newProductCategory.CreatedUser = accountId;
                    newProductCategory.CreatedTime = DateTime.Now;
                    newProductCategory.UrlSEO = StringHelpers.UrlEncode(newProductCategory.Name);
                    var productIds = request.Products.Select(p => p.Id);
                    var productInCategories = _unitOfWork.ProductInCategories.Find(p => productIds.Any(pid => pid == p.ProductId));
                    _unitOfWork.ProductInCategories.RemoveRange(productInCategories);

                    /// Save new product - product category to sub-table
                    if (request.Products != null && request.Products.Any())
                    {
                        newProductCategory.ProductInCategories = new List<ProductInCategory>();
                        request.Products.ForEach(product =>
                        {
                            var index = request.Products.IndexOf(product);
                            var productProductCategory = new ProductInCategory()
                            {
                                ProductId = product.Id,
                                ProductCategoryId = newProductCategory.Id,
                            };
                            newProductCategory.ProductInCategories.Add(productProductCategory);
                        });
                    }

                    _unitOfWork.ProductCategories.Add(newProductCategory);
                    await _unitOfWork.SaveChangesAsync();
                    // Complete this transaction, data will be saved.
                    await createTransaction.CommitAsync(cancellationToken);

                }
                catch (Exception ex)
                {
                    // Data will be restored.
                    await createTransaction.RollbackAsync(cancellationToken);
                    return BaseResponseModel.ReturnError(ex.Message);
                }

                return BaseResponseModel.ReturnData();
            });
        }

        private static BaseResponseModel RequestValidation(AdminCreateProductCategoryRequest request)
        {
            if (string.IsNullOrEmpty(request.Name))
            {
                return BaseResponseModel.ReturnError("Please enter product category name");
            }
            return null;
        }
    }
}
