using eShopping.Hangfire.Abstractions.Services;
using eShopping.Hangfire.Infrastructure.Services;
using eShopping.Hangfire.Options;

using Hangfire;
using Hangfire.MemoryStorage;
using Hangfire.SqlServer;

using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;

using System;
using System.Linq;
using System.Reflection;

namespace eShopping.Hangfire.Extensions
{
    public static class ServiceCollectionExtentions
    {
        public static void AddHangfireService(this IServiceCollection services, IConfiguration configuration)
        {
#if DEBUG
            services.AddHangfire(config => config.UseMemoryStorage());
#else
            services.AddHangfire(config => config
                .UseSimpleAssemblyNameTypeSerializer()
                .UseRecommendedSerializerSettings()
                .UseSqlServerStorage(configuration.GetConnectionString("Hangfire"), new SqlServerStorageOptions
                {
                    CommandBatchMaxTimeout = TimeSpan.FromMinutes(5),
                    SlidingInvisibilityTimeout = TimeSpan.FromMinutes(5),
                    QueuePollInterval = TimeSpan.Zero,
                    UseRecommendedIsolationLevel = true,
                    DisableGlobalLocks = true
                }));
#endif
            services.AddHangfireServer(options =>
            {
                //Register Queues
                //options.Queues = ["default"];
            });
        }

        public static void AddHttpClients(this IServiceCollection services, IConfiguration configuration)
        {
            using var scoped = services.BuildServiceProvider().CreateScope();
            var globalAppSetting = scoped.ServiceProvider.GetService<IOptions<GlobalAppSetting>>().Value;
            if (globalAppSetting == null)
            {
                throw new InvalidOperationException($"{nameof(GlobalAppSetting)} not found");
            }
            var httpClients = globalAppSetting.HttpClientSetting;

            PropertyInfo[] properties = typeof(HttpClientSetting).GetProperties();
            foreach (PropertyInfo property in properties)
            {
                var clientName = property.Name;
                var clientHost = httpClients.GetType().GetProperty(property.Name).GetValue(httpClients, null)?.ToString();
                if (Uri.IsWellFormedUriString(clientHost, UriKind.Absolute))
                {
                    services.AddHttpClient(clientName, client =>
                    {
                        client.BaseAddress = new Uri(clientHost);
                    });
                }
            }
        }

        public static void AddDI(this IServiceCollection services)
        {
            services.AddScoped<IRecurringJobManager, RecurringJobManager>();
            services.AddScoped<IServiceManagement, ServiceManagement>();
            AddJobsDI(services);
        }

        public static void AddAppInsightLogging(this IServiceCollection services, IConfiguration configuration)
        {
            services.RegisterApplicationInsightsLogging(configuration);
        }

        #region private methods

        private static void AddJobsDI(IServiceCollection serviceCollection)
        {
            var allJobsProviderTypes = System.Reflection.Assembly.GetAssembly(typeof(AssemblyReference))
            .GetTypes().Where(t => t.Namespace != null && t.Name.EndsWith("Job")).ToList();

            foreach (var intfc in allJobsProviderTypes.Where(t => t.IsInterface))
            {
                var impl = allJobsProviderTypes.FirstOrDefault(c => c.IsClass && intfc.Name.Substring(1) == c.Name);
                if (impl != null)
                {
                    serviceCollection.AddScoped(intfc, impl);
                }
            }
        }

        #endregion private methods
    }
}