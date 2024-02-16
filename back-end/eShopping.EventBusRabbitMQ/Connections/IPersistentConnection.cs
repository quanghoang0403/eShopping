using RabbitMQ.Client;

namespace eShopping.EventBusRabbitMQ.Connections
{
    public interface IPersistentConnection
    {
        event EventHandler OnReconnectedAfterConnectionFailure;

        bool IsConnected { get; }

        bool TryConnect();

        IModel CreateModel();
    }
}