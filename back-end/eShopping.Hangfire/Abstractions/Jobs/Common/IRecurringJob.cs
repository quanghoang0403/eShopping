using eShopping.Hangfire.Abstractions.Jobs.Common;

namespace eShopping.Hangfire.Abstractions
{
    public interface IRecurringJob : IJob
    {
        void Execute(params object[] args);
    }
}