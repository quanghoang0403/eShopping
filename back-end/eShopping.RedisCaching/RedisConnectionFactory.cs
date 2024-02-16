using StackExchange.Redis;

namespace eShopping.RedisCaching
{
    public interface IRedisConnectionFactory
    {
        ConnectionMultiplexer Connection();
    }

    public class RedisConnectionFactory : IRedisConnectionFactory
    {
        private readonly Lazy<ConnectionMultiplexer> _connection;

        public RedisConnectionFactory(string redisConnection)
        {
            this._connection = new Lazy<ConnectionMultiplexer>(() => ConnectionMultiplexer.Connect(redisConnection));
        }

        public ConnectionMultiplexer Connection()
        {
            return this._connection.Value;
        }
    }
}