using Newtonsoft.Json;

using StackExchange.Redis;

namespace eShopping.RedisCaching;

//refer: https://www.youtube.com/watch?v=V_vdMQ5dpM
public interface IRedisCacheService
{
    T? Get<T>(string cacheKey);

    void Set<T>(string cacheKey, T value);

    bool SetIfNotExists<T>(string cacheKey, T value);

    void Remove(string cachKey);

    void RemoveByPrefix(string prefixKey);

    bool KeyExists(string key);

    long IncreaseBy(string key, long quantity);

    long DecreaseBy(string key, long quantity);

    //==//
    Task<T?> GetAsync<T>(string cacheKey);

    Task SetAsync<T>(string cacheKey, T value);

    Task<bool> SetIfNotExistsAsync<T>(string cacheKey, T value);

    Task RemoveAsync(string cachKey);

    Task RemoveByPrefixAsync(string prefixKey);

    Task<bool> KeyExistsAsync(string key);

    Task<long> IncreaseByAsync(string key, long quantity);

    Task<long> DecreaseByAsync(string key, long quantity);

    //==/

    ITransaction CreateTransaction();
}

public class RedisCacheService : IRedisCacheService
{
    private readonly IRedisConnectionFactory _redisConnectionFactory;
    private readonly IDatabase _db;

    public RedisCacheService(IRedisConnectionFactory redisConnectionFactory)
    {
        _redisConnectionFactory = redisConnectionFactory;
        _db = _redisConnectionFactory.Connection().GetDatabase();
    }

    #region private methods

    private IServer GetServer()
    {
        var endpoints = _redisConnectionFactory.Connection().GetEndPoints();
        var server = _redisConnectionFactory.Connection().GetServer(endpoints[0]);

        return server;
    }

    private RedisKey[] GetKeysByPrefix(string prefix)
    {
        var server = GetServer();
        var keys = server.Keys(pattern: prefix + "*");
        return keys.ToArray() ?? Array.Empty<RedisKey>();
    }

    #endregion private methods

    #region public methods

    public T? Get<T>(string cacheKey)
    {
        var cacheValue = _db.StringGet(cacheKey);
        if (!cacheValue.HasValue)
        {
            return default(T?);
        }
        //string json = cacheValue.ToString();
        //if (string.IsNullOrEmpty(json))
        //{
        //    return default(T?);
        //}
        //T? value = JsonConvert.DeserializeObject<T>(json);
        //return value;
        try
        {
            T? valueDeserialized = JsonConvert.DeserializeObject<T>(cacheValue);
            return valueDeserialized;
        }
        catch (Exception)
        {
            return default(T?);
        }
    }

    public async Task<T?> GetAsync<T>(string cacheKey)
    {
        var cacheValue = await _db.StringGetAsync(cacheKey);
        if (!cacheValue.HasValue)
        {
            return default(T?);
        }
        try
        {
            T? valueDeserialized = JsonConvert.DeserializeObject<T>(cacheValue);
            return valueDeserialized;
        }
        catch (Exception)
        {
            return default(T?);
        }
    }

    public void Remove(string cachKey)
    {
        _db.KeyDelete(cachKey);
    }

    public async Task RemoveAsync(string cachKey)
    {
        await _db.KeyDeleteAsync(cachKey);
    }

    public void RemoveByPrefix(string prefixKey)
    {
        var keys = GetKeysByPrefix(prefixKey);

        foreach (var key in keys)
        {
            _db.KeyDelete(key);
        }
    }

    public async Task RemoveByPrefixAsync(string prefixKey)
    {
        RedisKey[] keys = GetKeysByPrefix(prefixKey);
        if (keys.Any())
        {
            IEnumerable<Task> tasks = keys.Select(key => RemoveAsync(key));
            await Task.WhenAll(tasks);
        }
    }

    public void Set<T>(string cacheKey, T value)
    {
        string valueString = JsonConvert.SerializeObject(value);
        _db.StringSet(cacheKey, valueString);
    }

    public async Task SetAsync<T>(string cacheKey, T value)
    {
        string valueString = JsonConvert.SerializeObject(value);
        await _db.StringSetAsync(cacheKey, valueString);
    }

    public bool SetIfNotExists<T>(string cacheKey, T value)
    {
        string valueString = JsonConvert.SerializeObject(value);
        return _db.StringSet(cacheKey, valueString, when: When.NotExists);
    }

    public async Task<bool> SetIfNotExistsAsync<T>(string cacheKey, T value)
    {
        string valueString = JsonConvert.SerializeObject(value);
        return await _db.StringSetAsync(cacheKey, valueString, when: When.NotExists);
    }

    public bool KeyExists(string key)
    {
        return _db.KeyExists(key);
    }

    public async Task<bool> KeyExistsAsync(string key)
    {
        return await _db.KeyExistsAsync(key);
    }

    public long IncreaseBy(string key, long quantity)
    {
        return _db.StringIncrement(key, quantity);
    }

    public async Task<long> IncreaseByAsync(string key, long quantity)
    {
        return await _db.StringIncrementAsync(key, quantity);
    }

    public long DecreaseBy(string key, long quantity)
    {
        return _db.StringDecrement(key, quantity);
    }

    public async Task<long> DecreaseByAsync(string key, long quantity)
    {
        return await _db.StringDecrementAsync(key, quantity);
    }

    public ITransaction CreateTransaction() => _db.CreateTransaction();

    #endregion public methods
}