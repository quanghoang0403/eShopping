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
                .Include(x => x.ProductVariants)
                .Include(x => x.ProductCategory)
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

        public async Task<Product> UpdateProductAsync(Product request, CancellationToken cancellationToken = default)
        {
            return await _dbContext.Database.CreateExecutionStrategy().ExecuteAsync(async () =>
            {
                using var transaction = await _dbContext.Database.BeginTransactionAsync(cancellationToken);
                try
                {
                    var productEdit = request;

                    #region Handle update product variants
                    // all product variants before update
                    var allProductVariants = await _dbContext.ProductVariants
                        .Where(x => x.ProductId == request.Id)
                        .AsNoTracking()
                        .ToListAsync(cancellationToken: cancellationToken);

                    // update product variants
                    if (request.ProductVariants.Any())
                    {
                        // remove unused product variants
                        var unusedProductVariants = allProductVariants.Where(x => !request.ProductVariants.Any(pn => pn.Id == x.Id));
                        _dbContext.ProductVariants.RemoveRange(unusedProductVariants);

                        // add product variants not insert to DB
                        var newProductVariants = request.ProductVariants.Where(p => p.Id == Guid.Empty);
                        var newProductVariantsToDB = new List<ProductVariant>();
                        foreach (var option in newProductVariants)
                        {
                            allProductVariants.Remove(option);
                            var newProductVariant = new ProductVariant()
                            {
                                Priority = option.Priority,
                                Name = option.Name,
                                PriceValue = option.PriceValue,
                                ProductId = productEdit.Id,
                                StartDate = option.StartDate,
                                EndDate = option.EndDate,
                                PriceOriginal = option.PriceOriginal,
                                PercentNumber = option.PercentNumber,
                                PriceDiscount = option.PriceDiscount
                            };
                            newProductVariantsToDB.Add(newProductVariant);
                            await _dbContext.ProductVariants.AddRangeAsync(newProductVariantsToDB, cancellationToken);
                        }

                        // update product variants existed
                        var reusedProductVariants = allProductVariants.Where(p => request.ProductVariants.Any(r => r.Id == p.Id));
                        foreach (var productVariant in reusedProductVariants)
                        {
                            var newProductVariant = request.ProductVariants.FirstOrDefault(p => p.Id == productVariant.Id);
                            productVariant.Priority = newProductVariant.Priority;
                            productVariant.Name = newProductVariant.Name;
                            productVariant.PriceValue = newProductVariant.PriceValue;
                            productVariant.PriceOriginal = newProductVariant.PriceOriginal;
                            productVariant.PriceDiscount = newProductVariant.PriceDiscount;
                            productVariant.PercentNumber = newProductVariant.PercentNumber;
                            productVariant.StartDate = newProductVariant.StartDate;
                            productVariant.EndDate = newProductVariant.EndDate;
                        }
                        _dbContext.ProductVariants.UpdateRange(reusedProductVariants);
                    }
                    #endregion

                    #region Handle update product stocks
                    // all product stocks before update

                    var sizeIds = await _dbContext.ProductSizes
                        .Where(s => s.ProductSizeCategoryId == request.ProductSizeCategoryId)
                        .Select(x => x.Id)
                        .ToListAsync();
                    var variantIds = await _dbContext.ProductVariants
                        .Where(s => s.ProductId == request.Id)
                        .Select(x => x.Id)
                        .ToListAsync();
                    // update product stocks
                    if (request.ProductStocks.Any())
                    {
                        // remove old product stocks
                        var oldProductStocks = await _dbContext.ProductStocks
                            .Where(x => x.ProductId == request.Id)
                            .AsNoTracking()
                            .ToListAsync(cancellationToken: cancellationToken);
                        _dbContext.ProductStocks.RemoveRange(oldProductStocks);

                        // add new product stocks not insert to DB 
                        var newProductStocksToDB = new List<ProductStock>();
                        foreach (var option in request.ProductStocks)
                        {
                            newProductStocksToDB.Add(option);
                            var newProductStock = new ProductStock()
                            {
                                ProductId = request.Id,
                                ProductVariantId = option.ProductVariantId,
                                ProductSizeId = option.ProductSizeId,
                                QuantityLeft = option.QuantityLeft,
                            };
                            newProductStocksToDB.Add(newProductStock);
                            await _dbContext.ProductStocks.AddRangeAsync(newProductStocksToDB, cancellationToken);
                        }
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
                    throw; // Rethrow the exception
                }
            });
            //return product;
        }
    }
}
