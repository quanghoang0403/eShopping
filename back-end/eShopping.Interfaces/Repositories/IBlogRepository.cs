using eShopping.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace eShopping.Interfaces.Repositories
{
    public interface IBlogRepository : IGenericRepository<Blog>
    {
        public Task<Blog> UpdateBlogAsync(Blog request, List<Guid> blogcategoryId, CancellationToken cancellationToken);
        public Task<Blog> GetBlogById(Guid id);
    }
}
