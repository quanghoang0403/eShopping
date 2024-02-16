﻿namespace eShopping.EventBus.Events
{
    public interface IIntegrationEventHandler<in TEvent>
        where TEvent : IntegrationEvent
    {
        Task HandleAsync(TEvent @event);
    }
}