using eShopping.Hangfire.Abstractions.Jobs.Common;
using eShopping.Hangfire.Shared.Models;

namespace eShopping.Hangfire.Abstractions.Jobs
{
    public interface ICallingApiJob : IFireAndForgetJob
    {
        void Execute(JobMetadata metadata);
    }
}