using Amazon.S3;
using eShopping.Application.Common;
using eShopping.Application.Common.Mappings;
using eShopping.Application.Store;
using eShopping.Application.Store.Mappings;
using eShopping.Application.Store.Middlewares;
using eShopping.Application.Store.Providers;
using eShopping.Common.AutoWire;
using eShopping.Email;
using eShopping.EventBusRabbitMQ;
using eShopping.Infrastructure.Repositories;
using eShopping.Interfaces;
using eShopping.MemoryCaching;
using eShopping.RedisCaching;
using eShopping.Services;
using eShopping.Storage;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using System;

namespace eShopping.WebApi.Store
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            //services.AddSignalR();
            services.AddCors();
            services.AddCors(options =>
            {
                options.AddPolicy("CorsPolicy",
                    builder => builder
                    .WithExposedHeaders("Token-Expired")
                    .WithExposedHeaders("X-STORE-ID")
                    );
            });

            services.AddOptions();
            services.AddControllers();
            services.AddHealthChecks();
            services.AddHttpContextAccessor();
            services.AddControllersWithViews().AddNewtonsoftJson(options => options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore);

            services.AddSwaggerDocumentation(Configuration);

            services
                .AutoInjectServices(Configuration)
                .AddIdentityInfrastructure(Configuration)
                .RegisterApplicationInsightsLogging(Configuration);

            services.AddApplicationLayer();
            services.AddSingleton(AutoMapperStoreConfig.Configure());
            services.AddSingleton(AutoMapperCommonConfig.Configure());
            services.AutoWire();

            // Auto register services from Application layer
            services.WithScopedLifetime<IApplicationStore>();
            services.WithScopedLifetime<IApplicationCommon>();
            services.WithScopedLifetime<IeShoppingStorage>();
            services.WithScopedLifetime<IeShoppingMemoryCaching>();

            // Email configurations.
            services.AddScoped<IEmailSenderProvider, EmailSenderProvider>();

            // Add Amazon S3 service
            services.AddAWSService<IAmazonS3>();

            services.AddScoped<IDateTimeService, DateTimeService>();
            services.AddScoped<IJWTService, JWTService>();


            services.AddScoped<IUserProvider, HttpUserProvider>();
            services.AddScoped<IUnitOfWork, UnitOfWork>();

            #region Add Redis Cache service

            var redisConnectionString = Configuration.GetValue<string>("RedisSettings:Connection");
            if (string.IsNullOrEmpty(redisConnectionString))
            {
                throw new ArgumentNullException(nameof(redisConnectionString));
            }
            services.AddSingleton<IRedisConnectionFactory>(
                provider => new RedisConnectionFactory(redisConnectionString)
            );
            services.AddScoped<IRedisCacheService, RedisCacheService>();

            #endregion Add Redis Cache service

            #region Add RabbitMQ service

            var rabbitMQSection = Configuration.GetSection("RabbitMQSettings");
            if (rabbitMQSection == null)
            {
                throw new ArgumentNullException(nameof(rabbitMQSection));
            }
            var rabbitMQConnectionUrl = rabbitMQSection["ConnectionUrl"];
            var rabbitMQBroker = rabbitMQSection["Broker"];
            var rabbitMQVirtualHost = rabbitMQSection["VirtualHost"];
            var rabbitMQQueue = rabbitMQSection["Queue"];
            var rabbitMQReconnectionTimeout = rabbitMQSection["TimeoutBeforeReconnecting"];
            if (string.IsNullOrEmpty(rabbitMQConnectionUrl) ||
                string.IsNullOrEmpty(rabbitMQBroker) ||
                string.IsNullOrEmpty(rabbitMQQueue) ||
                string.IsNullOrEmpty(rabbitMQReconnectionTimeout) ||
                !int.TryParse(rabbitMQReconnectionTimeout, out int _))
            {
                throw new ArgumentNullException(nameof(rabbitMQSection));
            }
            services.AddRabbitMQEventBus
            (
                connectionUrl: rabbitMQConnectionUrl,
                brokerName: rabbitMQBroker,
                virtualHost: rabbitMQVirtualHost,
                queueName: rabbitMQQueue,
                timeoutBeforeReconnecting: int.Parse(rabbitMQReconnectionTimeout)
            );

            #endregion Add RabbitMQ service
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            var config = (IConfiguration)app.ApplicationServices.GetService(typeof(IConfiguration));
            var enableSwagger = bool.Parse(config.GetValue<string>("EnableSwagger") ?? "false");
            if (enableSwagger || env.IsDevelopment())
            {
                app.UseSwaggerDocumentation();
            }

            app.UseCors(x => x
                .AllowAnyMethod()
                .AllowAnyHeader()
                .SetIsOriginAllowed(origin => true) // allow any origin
                .AllowCredentials()
                .WithExposedHeaders("Token-Expired")
                .WithExposedHeaders("X-STORE-ID")
                .WithExposedHeaders("X-TIMEZONE-OFFSET")
                ); // allow credentials

            app.UseMiddleware(typeof(StoreAuthenticationMiddleware));
            app.UseMiddleware(typeof(StoreErrorHandlingMiddleware));

            app.UseHttpsRedirection();

            app.UseRouting();

            app.UseAuthentication();
            app.UseAuthorization();
            app.UseStaticFiles();
            app.UseDefaultFiles();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });

            app.UseHealthChecks("/health");
        }
    }
}