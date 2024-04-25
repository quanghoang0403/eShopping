using AutoMapper;
using eShopping.Common.Exceptions;
using eShopping.Common.Helpers;
using eShopping.Domain.Entities;
using eShopping.Interfaces;
using MediatR;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace eShopping.Application.Features.Products.Commands
{
    public class AdminCreateProductCategoryRequest : IRequest<bool>
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

    public class AdminCreateProductCategoryRequestHandler : IRequestHandler<AdminCreateProductCategoryRequest, bool>
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

        public async Task<bool> Handle(AdminCreateProductCategoryRequest request, CancellationToken cancellationToken)
        {
            var loggedUser = await _userProvider.ProvideAsync(cancellationToken);

            RequestValidation(request);

            var productCategoryNameExisted = await _unitOfWork.ProductCategories.GetProductCategoryDetailByNameAsync(request.Name);
            ThrowError.Against(productCategoryNameExisted != null, new JObject()
            {
                { $"{nameof(request.Name)}", "Product category name has already existed" },
            });

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
                return false;
            }

            return true;
        }

        private static void RequestValidation(AdminCreateProductCategoryRequest request)
        {
            ThrowError.Against(string.IsNullOrEmpty(request.Name), "Please enter product category name");
        }
    }
}
