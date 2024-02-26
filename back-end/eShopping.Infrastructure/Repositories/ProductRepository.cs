using eShopping.Common.Extensions;
using eShopping.Domain.Entities;
using eShopping.Infrastructure.Contexts;
using eShopping.Interfaces.Repositories;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace eShopping.Infrastructure.Repositories
{
    public class ProductRepository : GenericRepository<Product>, IProductRepository
    {
        public ProductRepository(eShoppingDbContext dbContext) : base(dbContext) { }

        public Task<Product> GetProductByIdAsync(Guid id)
        {
            var product = _dbContext.Products.Where(p => p.Id == id).FirstOrDefaultAsync();
            return product;
        }

        public Task<Product> GetProductDetailByIdAsync(Guid id)
        {
            var product = _dbContext.Products.Where(p => p.Id == id)
                .Include(x => x.ProductOptions)
                .Include(x => x.ProductInCategories).ThenInclude(x => x.Category)
                .FirstOrDefaultAsync();
            return product;
        }

        public IQueryable<Product> GetProductByIds(List<Guid> productIds, List<string> includes = null)
        {
            var query = _dbContext.Products.Where(x => productIds.Contains(x.Id));

            if (includes != null)
            {
                includes.ForEach(property =>
                {
                    query = query.Include(property);
                });
            }
            return query;
        }

        public async Task<Product> UpdateProductAsync(Product request, List<Guid> categoryIds, CancellationToken cancellationToken = default)
        {
            using var transaction = await _dbContext.Database.BeginTransactionAsync(cancellationToken);
            try
            {
                var productEdit = await GetProductByIdAsync(request.Id);
                _dbContext.Attach(productEdit); // enable edit mode for product record

                #region Update product category
                var productProductCategoryIds = _dbContext.ProductInCategories.Where(x => x.ProductId == request.Id).Select(x => x.Id);
                if (productProductCategoryIds.Any())
                {
                    // Remove records from table ProductProductCategory
                    var recordIds = string.Join(",", productProductCategoryIds.Select(id => $"'{id}'"));
                    var sqlScript = $"DELETE FROM {nameof(ProductInCategory)} WHERE Id IN({recordIds})";
                    await _dbContext.Database.ExecuteSqlRawAsync(sqlScript, cancellationToken: cancellationToken);
                }

                // Add new ref product - product category via ProductInCategory table
                if (categoryIds.Any())
                {
                    var productInCategories = new List<ProductInCategory>();
                    foreach (var categoryId in categoryIds)
                    {
                        productInCategories.Add(new ProductInCategory()
                        {
                            ProductId = request.Id,
                            CategoryId = categoryId,
                        });
                    }
                    await _dbContext.ProductInCategories.AddRangeAsync(productInCategories, cancellationToken);
                }
                #endregion

                #region Handle update product options
                // all product options before update
                var allProductOptions = await _dbContext.ProductOptions
                    .Where(x => x.ProductId == request.Id)
                    .AsNoTracking()
                    .ToListAsync(cancellationToken: cancellationToken);

                // enable modify mode for records
                if (allProductOptions.Any())
                {
                    _dbContext.AttachRange(allProductOptions);
                }

                // update product options
                if (request.ProductOptions.Any())
                {
                    // remove unused product options
                    var unusedProductOptions = allProductOptions.Where(x => !request.ProductOptions.Any(pn => pn.Id == x.Id));
                    _dbContext.ProductOptions.RemoveRange(unusedProductOptions);

                    // add product options not insert to DB
                    var newProductOptions = request.ProductOptions.Where(p => p.Id == Guid.Empty);
                    var newProductOptionsToDB = new List<ProductOption>();
                    foreach (var option in unusedProductOptions)
                    {
                        allProductOptions.Remove(option);
                        var newProductOption = new ProductOption()
                        {
                            Priority = option.Priority,
                            Name = option.Name,
                            Price = option.Price,
                            ProductId = productEdit.Id,
                            QuantityLeft = option.QuantityLeft,
                            QuantitySold = option.QuantitySold,
                        };
                        newProductOptionsToDB.Add(newProductOption);
                        await _dbContext.ProductOptions.AddRangeAsync(newProductOptionsToDB, cancellationToken);
                    }

                    // update product options existed
                    foreach (var productOption in allProductOptions)
                    {
                        var newProductOption = request.ProductOptions.FirstOrDefault(p => p.Id == productOption.Id);
                        productOption.Priority = newProductOption.Priority;
                        productOption.Name = newProductOption.Name;
                        productOption.Price = newProductOption.Price;
                    }
                    _dbContext.ProductOptions.UpdateRange(allProductOptions);
                }
                #endregion

                #region Handle update product image

                #endregion

                await _dbContext.SaveChangesAsync(cancellationToken);
                await transaction.CommitAsync(cancellationToken);

                return productEdit;
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync(cancellationToken);
                Serilog.Log.Error(ex.ToJsonWithCamelCase());
            }

            return null;
        }
    }
}
