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

                #region Handle update product variants
                // all product variants before update
                var allProductVariants = await _dbContext.ProductOptions
                    .Where(x => x.ProductId == request.Id)
                    .AsNoTracking()
                    .ToListAsync(cancellationToken: cancellationToken);

                // enable modify mode for records
                if (allProductVariants.Any())
                {
                    _dbContext.AttachRange(allProductVariants);
                }

                // update product variants
                var latestProductOptions = new List<ProductOption>();
                if (request.ProductOptions.Any())
                {
                    // update product variant existed
                    var reuseProductVariants = new List<UpdateProductModel.PriceDto>();
                    foreach (var productVariant in allProductVariants)
                    {
                        var newProductVariant = request.ProductOptions.FirstOrDefault(p => p.Id == productVariant.Id);
                        if (newProductVariant == null) // If request variant not exist in current variants of product => remove
                        {
                            productVariant.IsDeleted = true;
                            continue;
                        }
                        else
                        {
                            // Re-use old record for new data
                            productVariant.Position = newProductVariant.Position;
                            productVariant.PriceName = newProductVariant.Name;
                            productVariant.PriceValue = newProductVariant.Price;
                            productVariant.IsDeleted = false;
                            reuseProductVariants.Add(newProductVariant);
                            latestProductVariants.Add(productVariant);
                        }
                    }

                    // Remaining product variants not insert to DB
                    var remainNewProductVariants = request.Prices.Where(p => !reuseProductVariants.Any(u => u.Name == p.Name && u.Price == u.Price));
                    if (remainNewProductVariants.Any())
                    {
                        var newProductVariants = remainNewProductVariants.Select(newPrice => new ProductPrice
                        {
                            Position = newPrice.Position,
                            PriceName = newPrice.Name,
                            PriceValue = newPrice.Price,
                            ProductId = productEdit.Id,
                            StoreId = storeId,
                            IsDeleted = false,
                        }).ToList();
                        latestProductVariants.AddRange(newProductVariants);
                        await _dbContext.ProductPrices.AddRangeAsync(newProductVariants, cancellationToken);
                    }
                }
                // update single product variant
                else
                {
                    bool updated = false; // flat to check the single variant updated
                    foreach (var productVariant in allProductVariants)
                    {
                        if (updated == true)
                        {
                            productVariant.IsDeleted = true; // remove variant not use
                        }
                        else
                        {
                            productVariant.Position = productVariant.Position;
                            productVariant.PriceName = string.Empty; // Not set price name for single price case
                            productVariant.PriceValue = request.Price;
                            productVariant.IsDeleted = false;

                            updated = true;
                            latestProductVariants.Add(productVariant);
                        }
                    }
                }
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
