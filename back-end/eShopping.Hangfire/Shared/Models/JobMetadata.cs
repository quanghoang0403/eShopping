using System;

namespace eShopping.Hangfire.Shared.Models
{
    public class JobMetadata
    {
        public string Queue { get; set; } = "default";
        public string Client { get; set; }
        public string Method { get; set; }
        public string Endpoint { get; set; }
        public string Payload { get; set; }

        public string CronExpression { get; set; }
        public EnumScheduleType ScheduleType { get; set; }
        public DateTimeOffset EnqueueAt { get; set; }
        public TimeSpan Delay { get; set; }

        public enum EnumScheduleType
        {
            Delay,
            EnqueueAt
        }
    }
}