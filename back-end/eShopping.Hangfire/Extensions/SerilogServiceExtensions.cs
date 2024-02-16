using eShopping.Hangfire.Options;
using eShopping.Loging.Serilog;

using Microsoft.ApplicationInsights.DependencyCollector;
using Microsoft.ApplicationInsights.Extensibility;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;

using Serilog;

using System;

namespace eShopping.Hangfire.Extensions
{
    public static class SerilogServiceExtensions
    {
        public static void RegisterApplicationInsightsLogging(this IServiceCollection services, IConfiguration configuration)
        {
            using var scoped = services.BuildServiceProvider().CreateScope();
            var globalAppSetting = scoped.ServiceProvider.GetService<IOptions<GlobalAppSetting>>().Value;
            if (globalAppSetting == null)
            {
                throw new InvalidOperationException($"{nameof(GlobalAppSetting)} not found");
            }

            services.AddSingleton<ILogger>(Log.Logger);
            services.EnableSqlCommandTextInstrumentation(globalAppSetting);
            services.SetupApplicationInsightsTelemetry(globalAppSetting);
            services.CreateLogger(configuration);
        }

        #region private methods

        private static void EnableSqlCommandTextInstrumentation(this IServiceCollection services, GlobalAppSetting globalAppSetting)
        {
            if (bool.TryParse(globalAppSetting.Serilog.EnableSqlCommandText, out bool enableSqlCommandText))
            {
                if (enableSqlCommandText)
                {
                    services.ConfigureTelemetryModule<DependencyTrackingTelemetryModule>((module, o) => { module.EnableSqlCommandTextInstrumentation = true; });
                }
            }
        }

        private static void SetupApplicationInsightsTelemetry(this IServiceCollection services, GlobalAppSetting globalAppSetting)
        {
            var instrumenationKey = globalAppSetting.Serilog.WriteTo[0].Args.instrumentationKey;
            var roleName = globalAppSetting.Serilog.WriteTo[0].Args.roleName;
            var roleInstance = globalAppSetting.Serilog.WriteTo[0].Args.roleInstance;

            services.Add(new ServiceDescriptor(typeof(ITelemetryInitializer), p => new TelemetryInitializer(roleName, roleInstance), ServiceLifetime.Singleton));
            services.AddSingleton<HttpContextEnricher>();
            services.AddApplicationInsightsTelemetry(instrumenationKey);
        }

        private static void CreateLogger(this IServiceCollection services, IConfiguration configuration)
        {
            Log.Logger = new LoggerConfiguration()
                .Enrich.WithHttpContext(services.BuildServiceProvider())
                .ReadFrom.Configuration(configuration)
                .CreateLogger();
        }

        #endregion private methods
    }
}