using eShopping.Common.Constants;
using eShopping.Domain.Entities;
using eShopping.Domain.Enums;
using eShopping.Interfaces;
using eShopping.Interfaces.Repositories;
using eShopping.MemoryCaching;
using Microsoft.AspNetCore.Http;
using System;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace eShopping.Application.Middlewares
{
    public class AuthenticationMiddleware
    {
        private readonly RequestDelegate _next;

        public AuthenticationMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task Invoke(
            HttpContext context,
            IJWTService jwtService,
            IAccountRepository accountRepository,
            IMemoryCachingService memoryCachingService
        )
        {
            try
            {
                var authorization = context.Request.Headers.FirstOrDefault(h => h.Key.Equals("Authorization"));
                var token = authorization.Key == null ? string.Empty : context.Request.Headers["Authorization"].FirstOrDefault().Substring("Bearer".Length).Trim();

                if (!string.IsNullOrEmpty(token))
                {
                    var isValid = IsValidUser(
                            jwtService,
                            memoryCachingService,
                            accountRepository,
                            token
                        );

                    if (!isValid)
                    {
                        var bytes = Encoding.UTF8.GetBytes("Unauthorized");
                        context.Response.StatusCode = (int)HttpStatusCode.Unauthorized;
                        context.Response.Headers.Add("Token-Expired", "true");
                        await context.Response.Body.WriteAsync(bytes.AsMemory(0, bytes.Length));

                        return;
                    }
                }


            }
            catch (Exception ex)
            {

            }
            await _next(context);
        }

        /// <summary>
        /// Check access token for store account or internal account
        /// </summary>
        /// <param name="jwtService"></param>
        /// <param name="memoryCachingService"></param>
        /// <param name="accountRepository"></param>
        /// <param name="internalAccountRepository"></param>
        /// <param name="token"></param>
        /// <returns></returns>
        private static bool IsValidUser(
            IJWTService jwtService,
            IMemoryCachingService memoryCachingService,
            IAccountRepository accountRepository,
            string token
        )
        {
            try
            {
                var isDataFromDatabase = false;
                var jwtToken = jwtService.ValidateToken(token);
                if (jwtToken == null)
                {
                    return false;
                }

                #region Check store account
                var claimAccountId = jwtToken.Claims.FirstOrDefault(x => x.Type == ClaimTypesConstants.ACCOUNT_ID);
                var claimAccountTypeId = jwtToken.Claims.FirstOrDefault(x => x.Type == ClaimTypesConstants.ACCOUNT_TYPE);
                if (claimAccountId != null)
                {
                    if (claimAccountTypeId != null && claimAccountTypeId.Value == $"{(int)EnumAccountType.User}")
                    {
                        var accountInCaching = memoryCachingService.GetCache<Account>(token);
                        if (accountInCaching != null)
                        {
                            return true;
                        }
                        else
                        {
                            Guid accountId = Guid.Empty;
                            if (Guid.TryParse(claimAccountId.Value, out accountId))
                            {
                                var account = accountRepository.GetAll().FirstOrDefault(x => x.Id == accountId);
                                if (account != null)
                                {
                                    memoryCachingService.SetCache(token, account);
                                    return true;
                                }
                            }
                        }
                    }
                    else
                    {
                        var account = memoryCachingService.GetCache<Account>(token);
                        if (account == null)
                        {
                            var accountId = Guid.Parse(claimAccountId.Value);
                            account = accountRepository.GetIdentifier(accountId);
                            isDataFromDatabase = true;
                        }

                        if (account != null)
                        {
                            if (isDataFromDatabase)
                            {
                                memoryCachingService.SetCache(token, account);
                            }

                            return true;
                        }
                    }

                }
                #endregion
            }
            catch (Exception) { }

            return false;
        }
    }
}
