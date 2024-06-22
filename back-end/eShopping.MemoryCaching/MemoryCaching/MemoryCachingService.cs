using Microsoft.Extensions.Caching.Memory;
using System;

namespace eShopping.MemoryCaching
{
    public class MemoryCachingService : IMemoryCachingService
    {
        private readonly IMemoryCache _memoryCache;

        public MemoryCachingService(IMemoryCache memoryCache)
        {
            _memoryCache = memoryCache;
        }

        public T GetCache<T>(string key)
        {
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
            var keyCache = $"{KeyCacheConstants.Prefix}_{key}";
            var cacheEntryOptions = new MemoryCacheEntryOptions { SlidingExpiration = timeExpried };
            _memoryCache.Set(keyCache, data, cacheEntryOptions);
        }
    }
}
