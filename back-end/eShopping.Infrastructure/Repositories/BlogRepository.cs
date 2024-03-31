using eShopping.Common.Extensions;
using eShopping.Domain.Entities;
using eShopping.Infrastructure.Contexts;
using eShopping.Interfaces.Repositories;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace eShopping.Infrastructure.Repositories
{
    public class BlogRepository : GenericRepository<Blog>, IBlogRepository
    {
        public BlogRepository(eShoppingDbContext dbContext) : base(dbContext)
        {
        }

        public async Task<Blog> GetBlogById(Guid id)
        {
            var blog = await _dbContext.Blogs.FindAsync(id);
            return blog;
        }

        public async Task<Blog> UpdateBlogAsync(Blog request, List<Guid> blogcategoryId, CancellationToken cancellationToken = default)
        {
            try
            {
                var blogmodified = await GetBlogById(request.Id);
                var blogCategoryId = _dbContext.BlogInCategories.Where(bc => bc.blogId == request.Id).Select(x => x.Id);
                if (blogCategoryId.Any())
                {
                    // Remove records from table ProductProductCategory
                    var recordIds = string.Join(",", blogCategoryId.Select(id => $"'{id}'"));
                    var sqlScript = $"DELETE FROM {nameof(BlogInCategory)} WHERE Id IN({recordIds})";
                    await _dbContext.Database.ExecuteSqlRawAsync(sqlScript, cancellationToken: cancellationToken);
                }
                if (blogcategoryId.Any())
                {
                    var blogInCategory = new List<BlogInCategory>();
                    foreach (var category in blogcategoryId)
                    {
                        blogInCategory.Add(new BlogInCategory
                        {
                            blogId = request.Id,
                            categoryId = category
                        });
                    }
                    await _dbContext.BlogInCategories.AddRangeAsync(blogInCategory, cancellationToken);
                }
                await _dbContext.SaveChangesAsync(cancellationToken);
                return blogmodified;
            }
            catch (Exception ex)
            {
                Serilog.Log.Error(ex.ToJsonWithCamelCase());
                return null;
            }

        }
    }
}
