using eShopping.Interfaces;
using eShopping.MemoryCaching;
using Microsoft.AspNetCore.Http;
using System;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace eShopping.Application.Store.Middlewares
{
    public class StoreAuthenticationMiddleware
    {
        private readonly RequestDelegate _next;

        public StoreAuthenticationMiddleware(
            RequestDelegate next)
        {
            _next = next;
        }

        public async Task Invoke(
            HttpContext context,
            IJWTService jwtService,
            IMemoryCachingService memoryCachingService)
        {
            var authorization = context.Request.Headers.FirstOrDefault(h => h.Key.Equals("Authorization"));
            var token = authorization.Key == null ? string.Empty : context.Request.Headers["Authorization"].FirstOrDefault().Substring("Bearer".Length).Trim();

            if (!string.IsNullOrEmpty(token))
            {
                var isValid = IsValidUser(jwtService, memoryCachingService, token);
                if (!isValid)
                {
                    await ThrowUnauthorizedUserAsync(context);
                    return;
                }
            }

            await _next(context);
        }

        private static bool IsValidUser(
           IJWTService jwtService,
           IMemoryCachingService memoryCachingService,
           string token)
        {
            try
            {
                var jwtToken = jwtService.ValidateToken(token);
                if (jwtToken == null)
                {
                    return false;
                }

                return true;
            }
            catch (Exception) { }

            return false;
        }

        private static async Task ThrowUnauthorizedUserAsync(HttpContext context)
        {
            var bytes = Encoding.UTF8.GetBytes("Unauthorized");
            context.Response.StatusCode = (int)HttpStatusCode.Unauthorized;
            context.Response.Headers.Add("Token-Expired", "true");
            await context.Response.Body.WriteAsync(bytes.AsMemory(0, bytes.Length));
        }
    }
}
