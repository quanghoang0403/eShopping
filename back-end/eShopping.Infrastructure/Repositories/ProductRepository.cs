using eShopping.Domain.Entities;
using eShopping.Infrastructure.Contexts;
using eShopping.Interfaces.Repositories;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
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
    }
}
