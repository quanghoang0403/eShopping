using eShopping.Common.Exceptions;
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
    public class AdminUpdateProductByProductCategoryRequest : IRequest<bool>
    {
        public Guid ProductCategoryId { get; set; }
        public IEnumerable<Guid> ProductByCategoryIds { get; set; }
    }
    public class AdminUpdateProductByProductCategoryRequestHandler : IRequestHandler<AdminUpdateProductByProductCategoryRequest, bool>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IUserProvider _userProvider;

        public AdminUpdateProductByProductCategoryRequestHandler(
            IUnitOfWork unitOfWork,
            IUserProvider userProvider
        )
        {
            _unitOfWork = unitOfWork;
            _userProvider = userProvider;
        }

        public async Task<bool> Handle(AdminUpdateProductByProductCategoryRequest request, CancellationToken cancellationToken)
        {
            var loggedUser = await _userProvider.ProvideAsync(cancellationToken);

            var modifiedProductCategory = await _unitOfWork.ProductCategories.Where(c => c.Id == request.ProductCategoryId).AsNoTracking().FirstOrDefaultAsync();
            ThrowError.Against(modifiedProductCategory == null, "Cannot find product category by id " + request.ProductCategoryId);
            return await _unitOfWork.CreateExecutionStrategy().ExecuteAsync(async () =>
            {
                using var createTransaction = await _unitOfWork.BeginTransactionAsync();
                try
                {
                    /// Delete product - product category from sub-table
                    var productIds = request.ProductByCategoryIds.Select(p => p);
                    var currentProductInCategories = _unitOfWork.ProductInCategories
                        .Find(p => p.ProductCategoryId == request.ProductCategoryId || productIds.Any(pid => pid == p.ProductId));
                    _unitOfWork.ProductInCategories.RemoveRange(currentProductInCategories);

                    var newProductInCategories = new List<ProductInCategory>();

                    if (request.ProductByCategoryIds != null && request.ProductByCategoryIds.Any())
                    {
                        /// Add new
                        foreach (var id in request.ProductByCategoryIds)
                        {
                            var newProduct = new ProductInCategory()
                            {
                                ProductCategoryId = request.ProductCategoryId,
                                ProductId = id,
                            };
                            newProductInCategories.Add(newProduct);
                        }

                        _unitOfWork.ProductInCategories.AddRange(newProductInCategories);
                    }
                    modifiedProductCategory.LastSavedUser = loggedUser.AccountId.Value;
                    modifiedProductCategory.LastSavedTime = DateTime.UtcNow;

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
            });
        }
    }
}
