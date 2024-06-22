using eShopping.Domain.Settings;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Options;
using System;

namespace eShopping.MemoryCaching
{
    public class MemoryCachingService : IMemoryCachingService
    {
        private readonly IMemoryCache _memoryCache;
        private readonly CacheSettings _cacheSettings;

        public MemoryCachingService(IMemoryCache memoryCache, IOptions<AppSettings> appSettings)
        {
            _memoryCache = memoryCache;
            _cacheSettings = appSettings.Value.CacheSettings;
        }

        public T GetCache<T>(string key)
        {
            if (!_cacheSettings.IsUseCache) return default;

            var keyCache = $"{KeyCacheConstants.Prefix}_{key}";
            var value = _memoryCache.Get<T>(keyCache);
            return value ?? default;
        }

        public void SetCache<T>(string key, T data)
        {
            SetCache(key, data, TimeCacheConstants.DateDay);
        }

        public void SetCache<T>(string key, T data, TimeSpan timeExpried)
        {
            if (!_cacheSettings.IsUseCache) return;
            var keyCache = $"{KeyCacheConstants.Prefix}_{key}";
            var cacheEntryOptions = new MemoryCacheEntryOptions { SlidingExpiration = timeExpried };
            _memoryCache.Set(keyCache, data, cacheEntryOptions);
        }
    }
}
