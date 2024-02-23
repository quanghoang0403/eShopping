using eShopping.Domain.Entities;
using eShopping.Infrastructure.Contexts;
using eShopping.Interfaces.Repositories;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace eShopping.Infrastructure.Repositories
{
    public class CategoryRepository : GenericRepository<Category>, ICategoryRepository
    {
        public CategoryRepository(eShoppingDbContext dbContext) : base(dbContext)
        {
        }

        public Task<Category> GetCategoryDetailByIdAsync(Guid categoryId)
        {
            var category = dbSet.FirstOrDefaultAsync(p => p.Id == categoryId);

            return category;
        }

        public Task<Category> GetCategoryDetailByUrlAsync(string categoryUrl)
        {
            var category = dbSet.FirstOrDefaultAsync(p => p.UrlSEO == categoryUrl);

            return category;
        }

        public Task<Category> GetCategoryDetailByNameAsync(string productCategoryName)
        {
            var productCategory = dbSet.FirstOrDefaultAsync(p => p.Name.Trim().ToLower().Equals(productCategoryName.Trim().ToLower()));

            return productCategory;
        }

        public IQueryable<Category> GetCategoryListByProductId(Guid productId)
        {
            //var categories = dbSet.Include(c => c.ProductInCategories).Where(c => c.ProductInCategories.Any(p => p.ProductId == productId));
            var categories = dbSet.Where(c => c.ProductInCategories.Any(p => p.ProductId == productId));
            return categories;
        }

        public Task<Category> CheckExistProductCategoryNameInStoreAsync(Guid productCategoryId, string productCategoryName)
        {
            var productCategory = dbSet.FirstOrDefaultAsync(p => p.Id != productCategoryId && p.Name.Trim().ToLower().Equals(productCategoryName.Trim().ToLower()));

            return productCategory;
        }
    }
}
