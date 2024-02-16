using eShopping.Hangfire.Extensions;
using eShopping.Hangfire.Options;

using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.OpenApi.Models;

using System;
using System.Threading.Tasks;

namespace eShopping.Hangfire
{
    public class Startup
    {
        public readonly IConfiguration Configuration;

        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public void ConfigureServices(IServiceCollection services)
        {
            services.AddControllers();

            services.AddSwaggerGen(c => c.SwaggerDoc("v1", new OpenApiInfo { Title = "GoF&B - Hangfire Service", Version = "v1" }));

            services.Configure<GlobalAppSetting>(x => Configuration.Bind(x));

            services.AddHangfireService(Configuration);

            services.AddHttpClients(Configuration);

            services.AddDI();

            services.AddAppInsightLogging(Configuration);
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env, IServiceProvider serviceProvider)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseSwagger();
                app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "GoF&B - Hangfire Service"));
            }

            app.UseHttpsRedirection();

            app.UseHangfireService(Configuration, serviceProvider);

            app.UseRouting();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapGet("/", context =>
                {
                    context.Response.Redirect("/dashboard", permanent: true);
                    return Task.CompletedTask;
                });
                endpoints.MapControllers();
            });
        }
    }
}