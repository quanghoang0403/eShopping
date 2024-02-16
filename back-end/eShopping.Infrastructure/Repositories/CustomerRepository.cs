using eShopping.Domain.Entities;
using eShopping.Infrastructure.Contexts;
using eShopping.Interfaces.Repositories;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace eShopping.Infrastructure.Repositories
{
    public class CustomerRepository : GenericRepository<Customer>, ICustomerRepository
    {
        public CustomerRepository(eShoppingDbContext dbContext) : base(dbContext) { }

        public async Task<List<Customer>> GetAllCustomersAsync()
        {
            var customers = await dbSet.Where(u => !u.IsDeleted).ToListAsync();
            return customers;
        }
    }
}