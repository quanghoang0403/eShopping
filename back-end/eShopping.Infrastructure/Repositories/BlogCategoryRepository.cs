﻿using eShopping.Domain.Entities;
using eShopping.Infrastructure.Contexts;
using eShopping.Interfaces.Repositories;

namespace eShopping.Infrastructure.Repositories
{
    public class BlogCategoryRepository : GenericRepository<BlogCategory>, IBlogCategoryRepository
    {
        public BlogCategoryRepository(eShoppingDbContext dbContext) : base(dbContext)
        {
        }
    }
}
