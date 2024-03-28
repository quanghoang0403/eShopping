using AutoMapper;
using eShopping.Common.Exceptions;
using eShopping.Common.Helpers;
using eShopping.Domain.Entities;
using eShopping.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace eShopping.Application.Features.Products.Commands
{
    public class AdminUpdateProductCategoryRequest : IRequest<bool>
    {
        public Guid Id { get; set; }

        public string Name { get; set; }

        public int Priority { get; set; }

        public string Content { get; set; }

        public string KeywordSEO { get; set; }

        public string UrlSEO { get; set; }

        public string TitleSEO { get; set; }

        public string DescriptionSEO { get; set; }

        public string Description { get; set; }

        public bool IsShowOnHome { set; get; }

        public List<AdminProductSelectedModel> Products { get; set; }
    }

    public class AdminProductSelectedModel
    {
        public Guid Id { get; set; }

        public int Position { get; set; }
    }

    public class AdminUpdateProductCategoryRequestHandler : IRequestHandler<AdminUpdateProductCategoryRequest, bool>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IUserProvider _userProvider;
        private readonly IMapper _mapper;

        public AdminUpdateProductCategoryRequestHandler(
            IUnitOfWork unitOfWork,
            IUserProvider userProvider,
            IMapper mapper
        )
        {
            _unitOfWork = unitOfWork;
            _userProvider = userProvider;
            _mapper = mapper;
        }

        public async Task<bool> Handle(AdminUpdateProductCategoryRequest request, CancellationToken cancellationToken)
        {
            var loggedUser = await _userProvider.ProvideAsync(cancellationToken);

            var productCategory = await _unitOfWork.ProductCategories.Where(c => c.Id == request.Id).AsNoTracking().FirstOrDefaultAsync();
            RequestValidation(request);
            ThrowError.Against(productCategory == null, "Cannot find product category information");

            var productCategoryNameExisted = await _unitOfWork.ProductCategories.Where(p => p.Id != request.Id && p.Name.Trim().ToLower().Equals(request.Name.Trim().ToLower())).AsNoTracking().FirstOrDefaultAsync();
            ThrowError.Against(productCategoryNameExisted != null, new JObject()
            {
                { $"{nameof(request.Name)}", "Product category name has already existed" },
            });

            // Create a new transaction to save data more securely, data will be restored if an error occurs.
            using var createTransaction = await _unitOfWork.BeginTransactionAsync();
            try
            {
                /// Delete product - product category from sub-table
                var productIds = request.Products.Select(p => p.Id);
                var currentProductInCategories = _unitOfWork.ProductInCategories
                    .Find(p => p.ProductCategoryId == productCategory.Id || productIds.Any(pid => pid == p.ProductId));
                _unitOfWork.ProductInCategories.RemoveRange(currentProductInCategories);

                var newProductInCategories = new List<ProductInCategory>();

                if (request.Products != null && request.Products.Any())
                {
                    /// Add new
                    request.Products.ForEach(product =>
                    {
                        var newProduct = new ProductInCategory()
                        {
                            ProductCategoryId = productCategory.Id,
                            ProductId = product.Id,
                        };
                        newProductInCategories.Add(newProduct);
                    });

                    _unitOfWork.ProductInCategories.AddRange(newProductInCategories);
                }

                var modifiedProductCategory = _mapper.Map<ProductCategory>(request);
                modifiedProductCategory.LastSavedUser = loggedUser.AccountId.Value;
                modifiedProductCategory.LastSavedTime = DateTime.UtcNow;
                modifiedProductCategory.UrlSEO = StringHelpers.UrlEncode(modifiedProductCategory.Name);
                
                await _unitOfWork.ProductCategories.UpdateAsync(modifiedProductCategory);
                await _unitOfWork.SaveChangesAsync();
                // Complete this transaction, data will be saved.
                await createTransaction.CommitAsync(cancellationToken);

            }
            catch (Exception ex)
            {
                // Data will be restored.
                await createTransaction.RollbackAsync(cancellationToken);
                return false;
            }

            return true;
        }

        private static void RequestValidation(AdminUpdateProductCategoryRequest request)
        {
            ThrowError.Against(string.IsNullOrEmpty(request.Name), "Please enter product category name");
        }
    }
}
