using eShopping.Common.Constants;
using eShopping.Domain.Settings;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using System;

namespace eShopping.Payment.Extensions
{
    public static class ServiceExtensions
    {
        public static void RegisterPaymentHttpClients(this IServiceCollection services)
        {
            services.RegisterPayPalHttpClient();
        }

        private static void RegisterPayPalHttpClient(this IServiceCollection services)
        {
            using var scoped = services.BuildServiceProvider().CreateScope();
            var globalAppSetting = scoped.ServiceProvider.GetService<IOptions<AppSettings>>().Value;
            var payPalRequestUrl = globalAppSetting?.PaymentSettings?.PayPalSettings?.PayPalUrl;
            if (globalAppSetting == null || string.IsNullOrWhiteSpace(payPalRequestUrl))
            {
                throw new InvalidOperationException($"{nameof(AppSettings)} not found");
            }

            services.AddHttpClient(HttpClientFactoryConstants.PAYPAL, client =>
            {
                client.BaseAddress = new Uri(payPalRequestUrl);
            });
        }
    }
}
