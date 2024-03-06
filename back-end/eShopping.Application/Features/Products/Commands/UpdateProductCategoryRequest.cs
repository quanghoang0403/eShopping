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
    public class UpdateProductCategoryRequest : IRequest<bool>
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

        public Guid? ParentId { set; get; }

        public List<ProductSelectedModel> Products { get; set; }

        public class ProductSelectedModel
        {
            public Guid Id { get; set; }

            public int Position { get; set; }
        }
    }

    public class UpdateProductCategoryRequestHandler : IRequestHandler<UpdateProductCategoryRequest, bool>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IUserProvider _userProvider;
        private readonly IMapper _mapper;

        public UpdateProductCategoryRequestHandler(
            IUnitOfWork unitOfWork,
            IUserProvider userProvider,
            IMapper mapper
        )
        {
            _unitOfWork = unitOfWork;
            _userProvider = userProvider;
            _mapper = mapper;
        }

        public async Task<bool> Handle(UpdateProductCategoryRequest request, CancellationToken cancellationToken)
        {
            var loggedUser = await _userProvider.ProvideAsync(cancellationToken);

            var productCategory = await _unitOfWork.ProductCategories.GetProductCategoryDetailByIdAsync(request.Id);
            RequestValidation(request);
            ThrowError.Against(productCategory == null, "Cannot find product category information");

            var productCategoryNameExisted = await _unitOfWork.ProductCategories.Where(p => p.Id != request.Id && p.Name.Trim().ToLower().Equals(request.Name.Trim().ToLower())).FirstOrDefaultAsync();
            ThrowError.Against(productCategoryNameExisted != null, new JObject()
            {
                { $"{nameof(request.Name)}", "Product category name has already existed" },
            });

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
            var accountId = loggedUser.AccountId.Value;
            modifiedProductCategory.LastSavedUser = accountId;
            modifiedProductCategory.LastSavedTime = DateTime.UtcNow;
            modifiedProductCategory.UrlSEO = StringHelpers.UrlEncode(modifiedProductCategory.Name);

            await _unitOfWork.ProductCategories.UpdateAsync(modifiedProductCategory);
            await _unitOfWork.SaveChangesAsync();

            return true;
        }

        private static void RequestValidation(UpdateProductCategoryRequest request)
        {
            ThrowError.Against(string.IsNullOrEmpty(request.Name), "Please enter product category name");
        }
    }
}
