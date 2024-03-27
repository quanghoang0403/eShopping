using eShopping.Domain.Entities;
using eShopping.Domain.Enums;
using eShopping.Infrastructure.Contexts;
using eShopping.Interfaces.Repositories;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace eShopping.Infrastructure.Repositories
{
    public class ImageRepository : GenericRepository<Image>, IImageRepository
    {
        public ImageRepository(eShoppingDbContext dbContext) : base(dbContext) { }

        public async Task<List<Image>> GetAllImagesByObjectId(Guid objectId, EnumImageTypeObject type)
        {
            var images = await dbSet.Where(i => i.ObjectId == objectId && i.ImageType == type).OrderByDescending(i => i.Priority).ToListAsync();
            return images;
        }
    }
}
