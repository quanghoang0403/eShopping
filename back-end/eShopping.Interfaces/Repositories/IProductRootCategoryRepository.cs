using eShopping.Domain.Entities;
using System.Threading.Tasks;
using System;

namespace eShopping.Interfaces.Repositories
{
    public interface IProductRootCategoryRepository : IGenericRepository<ProductRootCategory>
    {
        Task<ProductRootCategory> GetProductRootCategoryDetailByIdAsync(Guid categoryId);

        Task<ProductRootCategory> GetProductRootCategoryDetailByUrlAsync(string categoryUrl);

        Task<ProductRootCategory> GetProductRootCategoryDetailByNameAsync(string categoryName);
    }
}
