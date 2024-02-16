using eShopping.EventBus.Bus;
using eShopping.EventBus.Subscriptions;
using eShopping.EventBusRabbitMQ.Bus;
using eShopping.EventBusRabbitMQ.Connections;

using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

using RabbitMQ.Client;

namespace eShopping.EventBusRabbitMQ
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddRabbitMQEventBus(this IServiceCollection services,
            string connectionUrl,
            string virtualHost,
            string brokerName,
            string queueName,
            int timeoutBeforeReconnecting = 15)
        {
            services.AddSingleton<IEventSubscriptionManager, InMemoryEventBusSubscriptionsManager>();
            services.AddSingleton<IPersistentConnection, RabbitMQPersistentConnection>(factory =>
            {
                var connectionFactory = new ConnectionFactory
                {
                    Uri = new Uri(connectionUrl),
                    DispatchConsumersAsync = true,
                    VirtualHost = virtualHost ?? "/"
                };

                var logger = factory.GetService<ILogger<RabbitMQPersistentConnection>>();
                return new RabbitMQPersistentConnection(logger, connectionFactory, timeoutBeforeReconnecting);
            });
            services.AddSingleton<IEventBus, RabbitMQEventBus>(factory =>
            {
                var persistentConnection = factory.GetService<IPersistentConnection>();
                var subscriptionManager = factory.GetService<IEventSubscriptionManager>();
                var logger = factory.GetService<ILogger<RabbitMQEventBus>>();

                return new RabbitMQEventBus(logger, persistentConnection, subscriptionManager, factory, brokerName, queueName);
            });
            return services;
        }
    }
}