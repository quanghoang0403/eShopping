using eShopping.RedisCaching.Extensions;

using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace eShopping.RedisCaching
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddRedisService(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddRedisCaching(configuration);
            services.AddSingleton<IRedisCacheService, IRedisCacheService>();
            return services;
        }
    }
}