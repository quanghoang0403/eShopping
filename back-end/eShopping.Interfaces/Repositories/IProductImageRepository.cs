using eShopping.Domain.Entities;
using eShopping.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace eShopping.Interfaces.Repositories
{
    public interface IImageRepository : IGenericRepository<Image>
    {
        Task<List<Image>> GetAllImagesByObjectId(Guid objectId, EnumImageTypeObject type);
    }
}
