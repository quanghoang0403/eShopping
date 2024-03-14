using eShopping.Domain.Entities;
using eShopping.Infrastructure.Contexts;
using eShopping.Interfaces.Repositories;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace eShopping.Infrastructure.Repositories
{
    public class AccountRepository : GenericRepository<Account>, IAccountRepository
    {
        public AccountRepository(eShoppingDbContext dbContext) : base(dbContext) { }

        public async Task<List<Account>> GetAccountsAsync()
        {
            var accounts = await dbSet.Where(u => !u.IsDeleted).ToListAsync();
            return accounts;
        }

        public async Task<Account> GetIdentifierAsync(Guid accountId)
        {
            var account = await dbSet.FirstOrDefaultAsync(u => u.Id == accountId);

            return account;
        }

        public async Task<Account> GetAccountByEmailAsync(string email)
        {
            var account = await dbSet.FirstOrDefaultAsync(u => u.Email == email);

            return account;
        }

        public Account GetIdentifier(Guid accountId)
        {
            var account = dbSet.AsNoTracking().FirstOrDefault(u => u.Id == accountId);

            return account;
        }


        /// <summary>
        /// This method is used to get the customer by the login information;
        /// </summary>
        /// <param name="loginInfo">This is the customer's phone number or email address.</param>
        /// <param name="platformId">Platform id</param>
        /// <returns>Customer</returns>
        public async Task<Account> GetAccountAsync(string loginInfo, Guid? platformId = null)
        {
            Account account = await _dbContext
                .Accounts
                .FirstOrDefaultAsync(cus =>
                    (cus.Email == loginInfo ||
                    cus.PhoneNumber == loginInfo)
                );

            return account;
        }

        /// <summary>
        /// This method is used to get the customer status by the customer id.
        /// </summary>
        /// <param name="id">The customer id, for example: fa4dddae-ac71-4987-bf82-54224c1fcce5</param>
        /// <returns>EnumCustomerStatus</returns>
        public async Task<bool> GetAccountStatusByIdAsync(Guid id)
        {
            bool status = await dbSet.
                Where(cus => cus.Id == id).
                Select(cus => cus.IsActivated).
                SingleOrDefaultAsync();

            return status;
        }

        public async Task<Account> GetAccountActivatedByIdAsync(Guid id)
        {
            var account = await dbSet.FirstOrDefaultAsync(a => a.Id == id && a.IsActivated);
            return account;
        }

        public bool CheckAccountByPhone(string phone)
        {
            var account = dbSet.FirstOrDefault(c => c.PhoneNumber == phone);

            return account != null;
        }

        public bool CheckAccountByEmail(string email)
        {
            var account = dbSet.FirstOrDefault(c => c.Email == email);

            return account != null;
        }
    }
}
