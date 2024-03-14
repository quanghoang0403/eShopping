using eShopping.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace eShopping.Interfaces.Repositories
{
    public interface ICustomerRepository : IGenericRepository<Customer>
    {
        /// <summary>
        /// Get all customers in system
        /// </summary>
        /// <returns></returns>
        Task<List<Customer>> GetAllCustomersAsync();

        Task<Customer> GetCustomerById(Guid id);

    }
}
