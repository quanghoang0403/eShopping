using eShopping.Domain.Entities;
using eShopping.Infrastructure.Contexts;
using eShopping.Interfaces.Repositories;

namespace eShopping.Infrastructure.Repositories
{
    public class BlogRepository : GenericRepository<Blog>, IBlogRepository
    {
        public BlogRepository(eShoppingDbContext dbContext) : base(dbContext)
        {
        }
    }
}
