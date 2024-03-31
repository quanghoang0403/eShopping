using eShopping.Domain.Entities;
using eShopping.Infrastructure.Contexts;
using eShopping.Interfaces.Repositories;

namespace eShopping.Infrastructure.Repositories
{
    public class BlogInCategoryRepository : GenericRepository<BlogInCategory>, IBlogInCategoryRepository
    {
        public BlogInCategoryRepository(eShoppingDbContext dbContext) : base(dbContext)
        {
        }
    }
}
