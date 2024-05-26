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
            var blog = await _dbContext.Blogs.AsNoTracking().FirstOrDefaultAsync(b => b.Id == id);
            return blog;
        }

        public async Task<Blog> UpdateBlogAsync(Blog request, List<Guid> blogCategoryIds, CancellationToken cancellationToken = default)
        {
            return await _dbContext.Database.CreateExecutionStrategy().ExecuteAsync(async () =>
            {
                using var transaction = await _dbContext.Database.BeginTransactionAsync(cancellationToken);
                try
                {
                    var blogOriginal = await GetBlogById(request.Id);
                    var blogmodified = request;
                    var blogInCategories = await _dbContext.BlogInCategories.Where(bc => bc.BlogId == request.Id).ToListAsync();
                    _dbContext.RemoveRange(blogInCategories);
                    if (blogCategoryIds.Any())
                    {
                        var blogInCategory = new List<BlogInCategory>();
                        foreach (var category in blogCategoryIds)
                        {
                            blogInCategory.Add(new BlogInCategory
                            {
                                BlogId = request.Id,
                                BlogCategoryId = category
                            });
                        }
                        await _dbContext.BlogInCategories.AddRangeAsync(blogInCategory, cancellationToken);
                    }
                    blogmodified.CreatedTime = blogOriginal.CreatedTime;
                    _dbContext.Entry(blogmodified).State = EntityState.Modified;
                    await _dbContext.SaveChangesAsync(cancellationToken);
                    await transaction.CommitAsync(cancellationToken);
                    return blogmodified;
                }
                catch (Exception ex)
                {
                    Serilog.Log.Error(ex.ToJsonWithCamelCase());
                    return null;
                }
            });
        }
    }
}
