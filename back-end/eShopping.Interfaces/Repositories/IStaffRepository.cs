using System.Collections.Generic;
using System.Threading.Tasks;
using eShopping.Domain.Entities;

namespace eShopping.Interfaces.Repositories
{
    public interface IStaffRepository : IGenericRepository<Staff>
    {
        /// <summary>
        /// Get all staff in system
        /// </summary>
        /// <returns></returns>
        Task<List<Staff>> GetAllStaffsAsync();
    }
}
