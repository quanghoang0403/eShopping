namespace eShopping.Hangfire.Abstractions.Jobs.Common
{
    public interface IScheduleJob : IJob
    {
        void ScheduleJob();
    }
}