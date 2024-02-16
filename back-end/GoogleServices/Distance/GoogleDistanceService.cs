using eShopping.Domain.Enums;
using eShopping.Interfaces;
using eShopping.Loging.Serilog;
using GoogleServices.Geolocation.Models;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using System;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;

namespace GoogleServices.Distance
{
    public class GoogleDistanceService : IGoogleDistanceService
    {
        private readonly HttpClient _httpClient;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public GoogleDistanceService(
            IUnitOfWork unitOfWork,
            IHttpContextAccessor httpContextAccessor
            )
        {
            _unitOfWork = unitOfWork;
            _httpContextAccessor = httpContextAccessor;
            _httpClient = new HttpClient
            {
                BaseAddress = new Uri("https://maps.googleapis.com/")
            };
        }

        public async Task<int> GetDistanceBetweenPointsAsync(Guid storeId, double senderLat, double senderLng, double receiverLat, double receiverLng, CancellationToken cancellationToken)
        {
            var distanceValue = 0;
            var googleApiKey = await _unitOfWork.StoreGoogleConfigs.GetStoreGoogleConfigValueAsync(storeId, EnumGoogleConfigType.PosWebAPIKey);
            if (googleApiKey != null && googleApiKey != "")
            {
                var response = await _httpClient.GetAsync($"/maps/api/distancematrix/json?units=metric&origins={senderLat},{senderLng}&destinations={receiverLat},{receiverLng}&key={googleApiKey}", cancellationToken);
                distanceValue = ProcessWebResponse(response);

                var path = _httpContextAccessor.HttpContext.Request.Path;
                response.AddTraceLog(nameof(GetDistanceBetweenPointsAsync), path);
            }

            return distanceValue;
        }

        private static int ProcessWebResponse(HttpResponseMessage response)
        {
            if (!response.IsSuccessStatusCode) throw new Exception(response.ReasonPhrase);

            int distanceValue = 0;
            string serialized = string.Empty;
            using (var stream = response.Content.ReadAsStream())
            {
                using (var reader = new StreamReader(stream))
                {
                    serialized = reader.ReadToEnd();
                }
            }

            DistanceResponse result = JsonConvert.DeserializeObject<DistanceResponse>(serialized);

            var rows = result.Rows.ToArray();
            if (rows.Count() > 0)
            {
                var elements = rows[0].Elements.ToArray();
                distanceValue = elements[0].Distance != null ? elements[0].Distance.Value : 0;
            }

            return distanceValue;
        }
    }
}
