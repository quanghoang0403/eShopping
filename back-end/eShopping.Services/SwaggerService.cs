using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerUI;
using System.Collections.Generic;

namespace eShopping.Services
{
    public static class SwaggerService
    {
        private static readonly string _version = "v1.0";
        private static readonly string _title = "API v1.0";

        public static IServiceCollection AddSwaggerDocumentation(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddSwaggerGen(c =>
            {
                string applicationName = configuration.GetValue<string>("ApplicationName");
                string releaseVersion = configuration.GetValue<string>("ReleaseVersion");

                c.SwaggerDoc(_version, new OpenApiInfo { Title = $"{applicationName} (version {releaseVersion})", Version = _version });

                c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
                {
                    Description = "JWT Authorization header using the Bearer scheme. Example: \"Authorization: Bearer {token}\"",
                    Name = "Authorization",
                    In = ParameterLocation.Header,
                    Type = SecuritySchemeType.ApiKey,
                    Scheme = "Bearer"
                });

                // Swagger 2.+ support
                var security = new OpenApiSecurityRequirement()
                {
                    {
                        new OpenApiSecurityScheme
                        {
                            Reference = new OpenApiReference
                            {
                                Type = ReferenceType.SecurityScheme,
                                Id = "Bearer",
                            },
                            Scheme = "oauth2",
                            Name = "Bearer",
                            In = ParameterLocation.Header,
                        },
                        new List<string>()
                    }
                };
                c.AddSecurityRequirement(security);

                c.CustomSchemaIds(type => type.ToString());

                //c.ResolveConflictingActions(ApiDescriptionConflictResolver.Resolve);
                // UseFullTypeNameInSchemaIds replacement for .NET Core
                c.MapType(typeof(IFormFile), () => new OpenApiSchema() { Type = "file", Format = "binary" });

            });
            //services.AddSwaggerGenNewtonsoftSupport();

            return services;
        }

        public static IApplicationBuilder UseSwaggerDocumentation(this IApplicationBuilder app)
        {
            app.UseSwagger();
            app.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint("/swagger/v1.0/swagger.json", _title);
                c.DocumentTitle = "API Documentation";
                c.DocExpansion(DocExpansion.None);
            });

            return app;
        }
    }
}
