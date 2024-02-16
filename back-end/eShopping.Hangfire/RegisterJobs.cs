using eShopping.Hangfire.Abstractions;
using eShopping.Hangfire.Options;

using Hangfire;
using Hangfire.Common;

using Microsoft.Extensions.DependencyInjection;

using System;
using System.Data;
using System.Linq;
using System.Reflection;

namespace eShopping.Hangfire
{
    public static class RegisterJobs
    {
        public static void Run(GlobalAppSetting globalAppSetting, IServiceProvider serviceProvider)
        {
            AddRecurringJobs(globalAppSetting, serviceProvider);
        }

        private static void AddRecurringJobs(GlobalAppSetting globalAppSetting, IServiceProvider serviceProvider)
        {
            var recurringJobManager = serviceProvider.GetRequiredService<IRecurringJobManager>();
            var recurringJobTypes = AppDomain.CurrentDomain.GetAssemblies()
                    .SelectMany(s => s.GetTypes())
                    .Where(p => typeof(IRecurringJob).IsAssignableFrom(p) && p.IsClass)
                    .ToList();
            recurringJobTypes.ForEach(jobType =>
            {
                var jobSetting = globalAppSetting.JobSettings.Find(x => x.JobName == jobType.Name);
                if (jobSetting != null)
                {
                    var type = Type.GetType(jobType.FullName);
                    MethodInfo method = type.GetMethod("Execute");
                    Job tmp = new(type, method, string.Empty);
                    recurringJobManager.AddOrUpdate(jobSetting.JobName, tmp, jobSetting.CronExpression);
                }
            });
        }
    }
}