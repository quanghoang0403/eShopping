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
                    var isValid = jwtService.ValidateToken(token);

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
    }
}
