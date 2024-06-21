using eShopping.Application;
using eShopping.Application.Mappings;
using eShopping.Application.Middlewares;
using eShopping.Application.Providers;
using eShopping.Common.Attributes.Permission;
using eShopping.Common.AutoWire;
using eShopping.Domain.Enums;
using eShopping.Email;
using eShopping.Infrastructure.Repositories;
using eShopping.Interfaces;
using eShopping.Interfaces.Repositories;
using eShopping.MemoryCaching;
using eShopping.Payment.MoMo;
using eShopping.Payment.PayOS;
using eShopping.Payment.VNPay;
using eShopping.Services;
using eShopping.Services.User;
using eShopping.Storage;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;

namespace eShopping.WebApi
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
            services.AddCors(variants =>
            {
                variants.AddPolicy("CorsPolicy",
                    builder => builder
                    .WithExposedHeaders("Token-Expired", "Content-Disposition")
                );
            });

            services.AddOptions();
            services.AddControllers();
            services.AddHealthChecks();
            services.AddHttpContextAccessor();

            services.AddControllersWithViews().AddNewtonsoftJson(variants => variants.SerializerSettings.ReferenceLoopHandling = ReferenceLoopHandling.Ignore);

            services.AddSwaggerDocumentation(Configuration);

            services
                .AutoInjectServices(Configuration)
                .AddIdentityInfrastructure(Configuration)
                .RegisterApplicationInsightsLogging(Configuration);

            services.AddApplicationLayer();
            services.AddSingleton(AutoMapperCommonConfig.Configure());
            services.AutoWire();
            services.AddResponseCaching();

            // Auto register services from Application layer
            services.WithScopedLifetime<IApplication>();
            services.WithScopedLifetime<IStorage>();
            services.WithScopedLifetime<IMemoryCaching>();

            // Email configurations.
            services.AddScoped<IEmailSenderProvider, EmailSenderProvider>();
            services.AddScoped<IJWTService, JWTService>();

            services.AddScoped<IUserProvider, HttpUserProvider>();
            services.AddScoped<IUnitOfWork, UnitOfWork>();

            services.AddScoped<IPayOSService, PayOSService>();
            services.AddScoped<IMoMoPaymentService, MoMoPaymentService>();
            services.AddScoped<IVNPayService, VNPayService>();

            #region Register for Repositories

            services.AddScoped<IAccountRepository, AccountRepository>();
            services.AddScoped<IRefreshTokenRepository, RefreshTokenRepository>();
            services.AddScoped<ICustomerRepository, CustomerRepository>();
            services.AddScoped<IImageRepository, ImageRepository>();
            services.AddScoped<IOrderRepository, OrderRepository>();
            services.AddScoped<IOrderItemRepository, OrderItemRepository>();
            services.AddScoped<IPermissionRepository, PermissionRepository>();
            services.AddScoped<IPermissionGroupRepository, PermissionGroupRepository>();
            services.AddScoped<IProductRepository, ProductRepository>();
            services.AddScoped<IProductCategoryRepository, ProductCategoryRepository>();
            services.AddScoped<IProductRootCategoryRepository, ProductRootCategoryRepository>();
            services.AddScoped<IProductSizeRepository, ProductSizeRepository>();
            services.AddScoped<IProductSizeCategoryRepository, ProductSizeCategoryRepository>();
            services.AddScoped<IProductStockRepository, ProductStockRepository>();
            services.AddScoped<IProductVariantRepository, ProductVariantRepository>();
            services.AddScoped<IStaffRepository, StaffRepository>();
            services.AddScoped<IStaffPermissionRepository, StaffPermissionRepository>();

            #endregion Register for Repositories

            #region Register permission handler and add permission policies
            services.AddScoped<IUserPermissionService, UserPermissionService>();
            services.AddScoped<IAuthorizationHandler, PermissionHandler>();
            services.AddAuthorization(variants =>
            {

                var permissions = Enum.GetValues(typeof(EnumPermission))
                                .Cast<EnumPermission>()
                                .Select(e => e)
                                .ToList();

                foreach (var permission in permissions)
                {
                    variants.AddPolicy(permission.ToString(),
                        policy => policy.Requirements.Add(new PermissionRequirement(new List<EnumPermission> {
                             permission
                        })));
                }
            });

            #endregion Register permission handler and add permission policies

            #region Add Redis Cache service

            //var redisConnectionString = Configuration.GetValue<string>("RedisSettings:Connection");
            //if (string.IsNullOrEmpty(redisConnectionString))
            //{
            //    throw new ArgumentNullException(nameof(redisConnectionString));
            //}
            //services.AddSingleton<IRedisConnectionFactory>(
            //    provider => new RedisConnectionFactory(redisConnectionString)
            //);
            //services.AddScoped<IRedisCacheService, RedisCacheService>();

            #endregion Add Redis Cache service
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseSwaggerDocumentation();
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
                .WithExposedHeaders("Token-Expired", "Content-Disposition")
            );

            app.UseResponseCaching();

            app.UseMiddleware(typeof(AuthenticationMiddleware));
            app.UseMiddleware(typeof(ErrorHandlingMiddleware));

            app.UseHttpsRedirection();

            app.UseRouting();

            app.UseAuthentication();
            app.UseAuthorization();
            app.UseStaticFiles();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });

            app.UseHealthChecks("/health");
        }
    }
}