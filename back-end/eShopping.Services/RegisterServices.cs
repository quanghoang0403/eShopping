using eShopping.Domain.Settings;
using eShopping.Infrastructure.Contexts;
using eShopping.Loging.Serilog;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using Scrutor;
using System;
using System.Threading.Tasks;
using Thinktecture;

namespace eShopping.Services
{
    public static class RegisterServices
    {
        public static IServiceCollection AutoInjectServices(this IServiceCollection services, IConfiguration configuration)
        {
            // Manual config for mediator's target project
            //services.AddMediatR(AppDomain.CurrentDomain.Load("eShopping.Application"));

            services.AddDbContext<eShoppingDbContext>(options =>
            {
                options.UseSqlServer(configuration.GetConnectionString("DefaultConnection"), sqlOptions =>
                {
                    sqlOptions.AddRowNumberSupport();
                    //sqlOptions.EnableRetryOnFailure();
                });
                //options.EnableSensitiveDataLogging();
            });

            services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();
            services.AddHttpClient();
            services.AddRouting(options => options.LowercaseUrls = true);

            services.AddControllers().AddNewtonsoftJson(options =>
            {
                var jsonSerializerSettings = options.SerializerSettings;
                jsonSerializerSettings.NullValueHandling = NullValueHandling.Ignore;
                jsonSerializerSettings.ContractResolver = new CamelCasePropertyNamesContractResolver();
                jsonSerializerSettings.ReferenceLoopHandling = ReferenceLoopHandling.Ignore;
            });

            return services;
        }

        public static IServiceCollection WithScopedLifetime<T>(this IServiceCollection services)
        {
            services.Scan(scan => scan
                .FromAssemblyOf<T>()
                .AddClasses()
                .AsImplementedInterfaces()
                .UsingRegistrationStrategy(RegistrationStrategy.Skip)
                .AsMatchingInterface()
                .WithScopedLifetime());

            return services;
        }

        public static IServiceCollection WithTransientLifetime<T>(this IServiceCollection services)
        {
            services.Scan(scan => scan
                .FromAssemblyOf<T>()
                .AddClasses()
                .AsImplementedInterfaces()
                .UsingRegistrationStrategy(RegistrationStrategy.Skip)
                .AsMatchingInterface()
                .WithTransientLifetime());

            return services;
        }

        public static IServiceCollection AddIdentityInfrastructure(this IServiceCollection services, IConfiguration configuration)
        {
            // Register settings
            //services.Configure<MailSettings>(configuration.GetSection(nameof(MailSettings)));
            services.Configure<JWTSettings>(configuration.GetSection(nameof(JWTSettings)));
            services.Configure<DomainFE>(configuration.GetSection(nameof(DomainFE)));
            //services.Configure<SendGridMailSettings>(configuration.GetSection(nameof(SendGridMailSettings)));
            services.Configure<AppSettings>(configuration.GetSection(nameof(AppSettings)));

            var jwtSettings = configuration.GetSection(nameof(JWTSettings)).Get<JWTSettings>();
            services.AddAuthentication(opt =>
            {
                opt.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                opt.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(options =>
            {
                options.RequireHttpsMetadata = false;
                options.SaveToken = true;
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidIssuer = jwtSettings.Issuer,
                    ValidAudience = jwtSettings.Audience,
                    ClockSkew = TimeSpan.Zero,
                    IssuerSigningKey = new SymmetricSecurityKey(jwtSettings.SecretBytes)
                };
                options.Events = new JwtBearerEvents
                {
                    OnAuthenticationFailed = context =>
                    {
                        /// SecurityTokenExpiredException
                        if (context.Exception.GetType() == typeof(SecurityTokenExpiredException))
                        {
                            context.Response.Headers.Add("Token-Expired", "true");
                        }
                        return Task.CompletedTask;
                    },
                };
            });

            return services;
        }

        public static IServiceCollection RegisterApplicationInsightsLogging(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddSingleton<Serilog.ILogger>(Serilog.Log.Logger);
            services.EnableSqlCommandTextInstrumentation(configuration);
            services.SetupApplicationInsightsTelemetry(configuration);
            services.CreateLogger(configuration);

            return services;
        }
    }
}
