using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using System.IO;
using System.Reflection;

namespace eShopping.WebApi
{
    public class Program
    {
        public static void Main(string[] args)
        {
            CreateHostBuilder(args).Build().Run();
        }

        public static IHostBuilder CreateHostBuilder(string[] args)
        {
            var host = Host.CreateDefaultBuilder(args);
            host.ConfigureWebHostDefaults(webBuilder =>
            {
                webBuilder.UseStartup<Startup>();
            });

            host.ConfigureAppConfiguration((hostContext, config) =>
            {

                config.SetBasePath(Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location));

                /// Default
                config.AddJsonFile("appsettings.json", optional: true, false);

                /// Appsettings on local env
                config.AddJsonFile("appsettings.Development.json", optional: true, false);

                config.AddEnvironmentVariables();
            });

            return host;
        }
    }
}
