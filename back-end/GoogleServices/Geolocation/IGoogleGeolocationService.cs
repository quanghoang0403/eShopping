using GoogleServices.Geolocation.Models;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace GoogleServices.Geolocation
{
    public interface IGoogleGeolocationService
    {
        Task<GoogleAddress> GeocodeAsync(Guid storeId, string formattedAddress, CancellationToken cancellationToken);

        Task<GoogleAddress> GeocodeAsync(Guid storeId, string street, string city, string state, string postalCode, string country, CancellationToken cancellationToken);
    }
}
