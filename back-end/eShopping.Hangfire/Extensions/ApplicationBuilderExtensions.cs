using eShopping.Hangfire.Infrastructure;
using eShopping.Hangfire.Options;

using Hangfire;

using HangfireBasicAuthenticationFilter;

using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;

using System;

namespace eShopping.Hangfire.Extensions
{
    public static class ApplicationBuilderExtensions
    {
        public static void UseHangfireService(this IApplicationBuilder app, IConfiguration configuration, IServiceProvider serviceProvider)
        {
            var globalAppSetting = serviceProvider.GetRequiredService<IOptions<GlobalAppSetting>>().Value;
            if (globalAppSetting == null)
            {
                throw new InvalidOperationException($"{nameof(globalAppSetting)} not found");
            }

            app.UseHangfireDashboard("/dashboard", new DashboardOptions
            {
                DashboardTitle = "Hangfire Dashboard",
                StatsPollingInterval = 60000,
                Authorization = new[]
                {
                    new HangfireCustomBasicAuthenticationFilter
                    {
                        User = globalAppSetting.Hangfire.User,
                        Pass = globalAppSetting.Hangfire.Pass
                    }
                }
            });

            GlobalConfiguration.Configuration.UseActivator(new HangfireActivator(serviceProvider));
            GlobalJobFilters.Filters.Add(new AutomaticRetryAttribute { Attempts = 0 });

            RegisterJobs.Run(globalAppSetting, serviceProvider);
        }
    }
}