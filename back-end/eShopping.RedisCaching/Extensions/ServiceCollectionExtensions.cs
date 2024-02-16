using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace eShopping.RedisCaching.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddRedisCaching(this IServiceCollection services, IConfiguration configuration)
    {
        var redisSettingSection = configuration.GetSection("RedisSettings");

        var redisConnection = redisSettingSection["Connection"];
        if (redisConnection == null)
            throw new ArgumentNullException("Redis Connection is not valid");

        var redisInstanceName = redisSettingSection["InstanceName"];
        if (redisConnection == null)
            throw new ArgumentNullException("Redis InstanceName is not valid");

        services.AddSingleton<IRedisConnectionFactory>(provider => new RedisConnectionFactory("localhost:6379,abortConnect=false,connectTimeout=30000,responseTimeout=30000"));
        services.AddScoped<IRedisCacheService, RedisCacheService>();

        return services;
    }
}