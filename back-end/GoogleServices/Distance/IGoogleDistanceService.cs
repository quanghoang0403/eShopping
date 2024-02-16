using System;
using System.Threading;
using System.Threading.Tasks;

namespace GoogleServices.Distance
{
    public interface IGoogleDistanceService
    {
        Task<int> GetDistanceBetweenPointsAsync(Guid storeId, double senderLat, double senderLng, double receiverLat, double receiverLng, CancellationToken cancellationToken);
    }
}
