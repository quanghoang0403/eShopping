using eShopping.Domain.Entities;
using eShopping.Infrastructure.Contexts;
using eShopping.Interfaces.Repositories;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace eShopping.Infrastructure.Repositories
{
    public class ProductCategoryRepository : GenericRepository<ProductCategory>, IProductCategoryRepository
    {
        public ProductCategoryRepository(eShoppingDbContext dbContext) : base(dbContext)
        {
        }

        public Task<ProductCategory> GetProductCategoryDetailByIdAsync(Guid categoryId)
        {
            var category = dbSet.FirstOrDefaultAsync(p => p.Id == categoryId);

            return category;
        }

        public Task<ProductCategory> GetProductCategoryDetailByUrlAsync(string categoryUrl)
        {
            var category = dbSet.FirstOrDefaultAsync(p => p.UrlSEO == categoryUrl);

            return category;
        }

        public Task<ProductCategory> GetProductCategoryDetailByNameAsync(string productCategoryName)
        {
            var productCategory = dbSet.FirstOrDefaultAsync(p => p.Name.Trim().ToLower().Equals(productCategoryName.Trim().ToLower()));

            return productCategory;
        }

        public IQueryable<ProductCategory> GetProductCategoryListByProductId(Guid productId)
        {
            //var categories = dbSet.Include(c => c.ProductInCategories).Where(c => c.ProductInCategories.Any(p => p.ProductId == productId));
            var categories = dbSet.Where(c => c.ProductInCategories.Any(p => p.ProductId == productId));
            return categories;
        }
    }
}
