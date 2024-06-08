using eShopping.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace eShopping.Interfaces.Repositories
{
    public interface IProductRepository : IGenericRepository<Product>
    {
        Task<Product> GetProductByIdAsync(Guid id);

        Task<Product> GetProductDetailByIdAsync(Guid id);

        IQueryable<Product> GetProductByIds(List<Guid> productIds, List<string> includes = null);
    }
}
