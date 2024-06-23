using System;

namespace eShopping.MemoryCaching
{
    public interface IMemoryCachingService
    {
        T GetCache<T>(string key);

        void SetCache<T>(string key, T data);

        void SetCache<T>(string key, T data, TimeSpan timeExpried);
    }
}
