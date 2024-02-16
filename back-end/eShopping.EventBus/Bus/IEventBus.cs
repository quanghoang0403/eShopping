using eShopping.EventBus.Events;

namespace eShopping.EventBus.Bus
{
    public interface IEventBus
    {
        bool Publish<T>(T @event)
            where T : IntegrationEvent;

        bool Subscribe<T, TH>()
            where T : IntegrationEvent
            where TH : IIntegrationEventHandler<T>;

        bool Unsubscribe<T, TH>()
            where TH : IIntegrationEventHandler<T>
            where T : IntegrationEvent;
    }
}