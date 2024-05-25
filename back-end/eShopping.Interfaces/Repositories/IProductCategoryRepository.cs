using eShopping.Domain.Entities;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace eShopping.Interfaces.Repositories
{
    public interface IProductCategoryRepository : IGenericRepository<ProductCategory>
    {
        Task<ProductCategory> GetProductCategoryDetailByIdAsync(Guid categoryId);

        Task<ProductCategory> GetProductCategoryDetailByUrlAsync(string categoryUrl);

        Task<ProductCategory> GetProductCategoryDetailByNameAsync(string categoryName);
    }
}
