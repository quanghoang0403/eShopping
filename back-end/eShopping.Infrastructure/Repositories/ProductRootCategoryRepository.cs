using eShopping.Domain.Entities;
using eShopping.Infrastructure.Contexts;
using eShopping.Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using System;

namespace eShopping.Interfaces.Repositories
{
    public class ProductRootCategoryRepository : GenericRepository<ProductRootCategory>, IProductRootCategoryRepository
    {
        public ProductRootCategoryRepository(eShoppingDbContext dbContext) : base(dbContext)
        {
        }

        public Task<ProductRootCategory> GetProductRootCategoryDetailByIdAsync(Guid categoryId)
        {
            var category = dbSet.Include(c => c.Products).FirstOrDefaultAsync(p => p.Id == categoryId);

            return category;
        }

        public Task<ProductRootCategory> GetProductRootCategoryDetailByUrlAsync(string categoryUrl)
        {
            var category = dbSet.FirstOrDefaultAsync(p => p.UrlSEO == categoryUrl);

            return category;
        }

        public Task<ProductRootCategory> GetProductRootCategoryDetailByNameAsync(string ProductRootCategoryName)
        {
            var ProductRootCategory = dbSet.FirstOrDefaultAsync(p => p.Name.Trim().ToLower().Equals(ProductRootCategoryName.Trim().ToLower()));

            return ProductRootCategory;
        }
    }
}
