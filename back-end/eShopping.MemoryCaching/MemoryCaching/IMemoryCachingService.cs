namespace eShopping.MemoryCaching
{
    public interface IMemoryCachingService
    {
        T GetCache<T>(string key);

        void SetCache<T>(string key, T data);

        void SetCache<T>(string key, T data, int slidingExpirationFromMinutes);
    }
}
