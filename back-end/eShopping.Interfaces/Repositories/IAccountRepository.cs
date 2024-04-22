using eShopping.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace eShopping.Interfaces.Repositories
{
    public interface IAccountRepository : IGenericRepository<Account>
    {
        /// <summary>
        /// Get all accounts in system
        /// </summary>
        /// <returns></returns>
        Task<List<Account>> GetAccountsAsync();

        /// <summary>
        /// Find account information by email
        /// </summary>
        /// <param name="username"></param>
        /// <returns></returns>
        Task<Account> GetAccountByEmailAsync(string email);

        /// <summary>
        /// Find account information by accountId
        /// </summary>
        /// <param name="accountId"></param>
        /// <returns></returns>
        Task<Account> GetIdentifierAsync(Guid userId);

        /// <summary>
        /// Find account information by accountId
        /// </summary>
        /// <param name="accountId"></param>
        /// <returns></returns>
        Account GetIdentifier(Guid accountId);


        /// <summary>
        /// This method is used to get the customer by the login information;
        /// </summary>
        /// <param name="loginInfo">This is the customer's phone number or email address.</param>
        /// <param name="platformId">Platform Id</param>
        /// <returns>Customer</returns>
        Task<Account> GetAccountAsync(string loginInfo, Guid? platformId = null);

        /// <summary>
        /// This method is used to get the customer status by the customer id.
        /// </summary>
        /// <param name="id">The customer id, for example: fa4dddae-ac71-4987-bf82-54224c1fcce5</param>
        /// <returns>EnumCustomerStatus</returns>
        Task<bool> GetAccountStatusByIdAsync(Guid id);

        Task<Account> GetAccountActivatedByIdAsync(Guid id);

        bool CheckAccountByPhone(string phone, Guid accountID);
        bool CheckAccountByPhone(string phone);

        bool CheckAccountByEmail(string email, Guid accountId);
        bool CheckAccountByEmail(string email);

    }
}
