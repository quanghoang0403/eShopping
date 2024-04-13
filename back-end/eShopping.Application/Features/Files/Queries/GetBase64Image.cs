using MediatR;
using System;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;

namespace eShopping.Application.Features.Files.Queries
{
    public class GetBase64ImageRequest : IRequest<GetBase64ImageResponse>
    {
        public string Url { get; set; }
    }

    public class GetBase64ImageResponse
    {
        public string ImageData { get; set; }
    }

    public class GetBase64ImageRequestHandler : IRequestHandler<GetBase64ImageRequest, GetBase64ImageResponse>
    {
        public GetBase64ImageRequestHandler() { }

        public async Task<GetBase64ImageResponse> Handle(GetBase64ImageRequest request, CancellationToken cancellationToken)
        {
            return new GetBase64ImageResponse
            {
                ImageData = await GetImageAsBase64UrlAsync(request.Url),
            };
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
