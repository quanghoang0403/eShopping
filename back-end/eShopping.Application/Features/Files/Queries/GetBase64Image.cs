using eShopping.Common.Models;
using MediatR;
using System;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;

namespace eShopping.Application.Features.Files.Queries
{
    public class GetBase64ImageRequest : IRequest<BaseResponseModel>
    {
        public string Url { get; set; }
    }

    public class GetBase64ImageResponse
    {
        public string ImageData { get; set; }
    }

    public class GetBase64ImageRequestHandler : IRequestHandler<GetBase64ImageRequest, BaseResponseModel>
    {
        public GetBase64ImageRequestHandler() { }

        public async Task<BaseResponseModel> Handle(GetBase64ImageRequest request, CancellationToken cancellationToken)
        {
            var imageData = await GetImageAsBase64UrlAsync(request.Url);
            return BaseResponseModel.ReturnData(imageData);
        }

        private async static Task<string> GetImageAsBase64UrlAsync(string url)
        {
            if (string.IsNullOrEmpty(url))
            {
                return url;
            }

            try
            {
                using (HttpClient client = new HttpClient())
                {
                    using (HttpResponseMessage response = await client.GetAsync(url))
                    {
                        response.EnsureSuccessStatusCode();

                        using (HttpContent content = response.Content)
                        {
                            byte[] imageBytes = await content.ReadAsByteArrayAsync();
                            string base64String = Convert.ToBase64String(imageBytes);
                            return $"data:image/png;base64,{base64String}";
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                Serilog.Log.Information(ex.ToString());
                return url;
            }
        }
    }
}
