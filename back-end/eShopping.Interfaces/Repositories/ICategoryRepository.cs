using eShopping.Domain.Entities;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace eShopping.Interfaces.Repositories
{
    public interface ICategoryRepository : IGenericRepository<Category>
    {
        Task<Category> GetCategoryDetailByIdAsync(Guid categoryId);

        Task<Category> GetCategoryDetailByUrlAsync(string categoryUrl);

        Task<Category> GetCategoryDetailByNameAsync(string categoryName);

        IQueryable<Category> GetCategoryListByProductId(Guid productId);

        Task<Category> CheckExistProductCategoryNameInStoreAsync(Guid productCategoryId, string productCategoryName);

    }
}
