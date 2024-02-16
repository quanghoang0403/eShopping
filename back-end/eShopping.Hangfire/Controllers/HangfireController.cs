using eShopping.Hangfire.Abstractions.Jobs;
using eShopping.Hangfire.Shared.Models;

using Hangfire;

using Microsoft.AspNetCore.Mvc;

using System;

using static eShopping.Hangfire.Shared.Models.JobMetadata;

namespace eShopping.Hangfire.Controllers
{
    public class HangfireController : BaseApiController
    {
        private readonly ICallingApiJob _callingApiJob;

        public HangfireController(ICallingApiJob callingApiJob)
        {
            _callingApiJob = callingApiJob;
        }

        [HttpPost("EnqueueCallingApi")]
        public IActionResult EnqueueCallingApi([FromBody] JobMetadata metadata)
        {
            try
            {
                var jobId = BackgroundJob.Enqueue(() => _callingApiJob.Execute(metadata));
                return HangfireResponse(true, jobId);
            }
            catch (Exception ex)
            {
                return HangfireResponse(false, ex.Message);
            }
        }

        [HttpPost("ScheduleCallingApi")]
        public IActionResult ScheduleCallingApi([FromBody] JobMetadata metadata)
        {
            try
            {
                var jobId = string.Empty;
                switch (metadata.ScheduleType)
                {
                    case EnumScheduleType.Delay:
                        jobId = BackgroundJob.Schedule(metadata.Queue, () => _callingApiJob.Execute(metadata), metadata.Delay);
                        return HangfireResponse(true, jobId);

                    case EnumScheduleType.EnqueueAt:
                        jobId = BackgroundJob.Schedule(metadata.Queue, () => _callingApiJob.Execute(metadata), metadata.EnqueueAt);
                        return HangfireResponse(true, jobId);

                    default: break;
                }
                return HangfireResponse(false, "Invalid SheduleType (0:Delay, 1:EnqueueAt)");
            }
            catch (Exception ex)
            {
                return HangfireResponse(false, ex.Message);
            }
        }
    }
}