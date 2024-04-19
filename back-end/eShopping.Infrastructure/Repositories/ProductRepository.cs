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
                .Include(x => x.ProductPrices)
                .Include(x => x.ProductInCategories).ThenInclude(x => x.ProductCategory)
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
                var productEdit = request;

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
                            ProductCategoryId = categoryId,
                        });
                    }
                    await _dbContext.ProductInCategories.AddRangeAsync(productInCategories, cancellationToken);
                }
                #endregion

                #region Handle update product prices
                // all product prices before update
                var allProductPrices = await _dbContext.ProductPrices
                    .Where(x => x.ProductId == request.Id)
                    .AsNoTracking()
                    .ToListAsync(cancellationToken: cancellationToken);

                // update product prices
                if (request.ProductPrices.Any())
                {
                    // remove unused product prices
                    var unusedProductPrices = allProductPrices.Where(x => !request.ProductPrices.Any(pn => pn.Id == x.Id));
                    _dbContext.ProductPrices.RemoveRange(unusedProductPrices);

                    // add product prices not insert to DB
                    var newProductPrices = request.ProductPrices.Where(p => p.Id == Guid.Empty);
                    var newProductPricesToDB = new List<ProductPrice>();
                    foreach (var option in newProductPrices)
                    {
                        allProductPrices.Remove(option);
                        var newProductPrice = new ProductPrice()
                        {
                            Priority = option.Priority,
                            PriceName = option.PriceName,
                            PriceValue = option.PriceValue,
                            ProductId = productEdit.Id,
                            QuantityLeft = option.QuantityLeft,
                            QuantitySold = option.QuantitySold,
                            StartDate = option.StartDate,
                            EndDate = option.EndDate,
                            PriceOriginal = option.PriceOriginal,
                            PercentNumber = option.PercentNumber,
                            PriceDiscount = option.PriceDiscount
                        };
                        newProductPricesToDB.Add(newProductPrice);
                        await _dbContext.ProductPrices.AddRangeAsync(newProductPricesToDB, cancellationToken);
                    }

                    // update product prices existed
                    var reusedProductPrices = allProductPrices.Where(p => request.ProductPrices.Any(r => r.Id == p.Id));
                    foreach (var productPrice in reusedProductPrices)
                    {
                        var newProductPrice = request.ProductPrices.FirstOrDefault(p => p.Id == productPrice.Id);
                        productPrice.Priority = newProductPrice.Priority;
                        productPrice.PriceName = newProductPrice.PriceName;
                        productPrice.PriceValue = newProductPrice.PriceValue;
                        productPrice.PriceOriginal = newProductPrice.PriceOriginal;
                        productPrice.PriceDiscount = newProductPrice.PriceDiscount;
                        productPrice.PercentNumber = newProductPrice.PercentNumber;
                        productPrice.StartDate = newProductPrice.StartDate;
                        productPrice.EndDate = newProductPrice.EndDate;
                    }
                    _dbContext.ProductPrices.UpdateRange(reusedProductPrices);
                }
                if (productEdit.ProductPrices.Any(p => p.PriceDiscount > 0 || p.PercentNumber > 0))
                {
                    productEdit.IsDiscounted = true;
                }
                else
                {
                    productEdit.IsDiscounted = false;
                }
                #endregion

                #region Handle update product image

                #endregion
                _dbContext.Entry(productEdit).State = EntityState.Modified;
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
