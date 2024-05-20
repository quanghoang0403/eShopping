using eShopping.Common.Constants;
using eShopping.Common.Models;
using eShopping.Interfaces.Common;
using eShopping.Storage.Azure;
using eShopping.Storage.Models;
using MediatR;
using Microsoft.AspNetCore.Http;
using System;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace eShopping.Application.Features.Files.Commands
{
    public class UploadFileRequest : IRequest<BaseResponseModel>
    {
        public UploadFileRequest()
        {
            FileSizeLimit = DefaultConstants.STORE_IMAGE_LIMIT;
        }

        public IFormFile File { get; set; }

        public string FileName { get; set; }

        public int FileSizeLimit { get; set; } = DefaultConstants.STORE_IMAGE_LIMIT;
    }

    public class UploadFileResponse
    {
        public string Link { get; set; }

        public UploadFileResponse(string link)
        {
            Link = link;
        }
    }

    public class UploadFileRequestHandler : IRequestHandler<UploadFileRequest, BaseResponseModel>
    {
        private readonly IAzureStorageService _azureStorageService;
        private readonly IImageService _imageService;

        public UploadFileRequestHandler(IAzureStorageService azureStorageService, IImageService imageService)
        {
            _azureStorageService = azureStorageService;
            _imageService = imageService;
        }

        async Task<BaseResponseModel> IRequestHandler<UploadFileRequest, BaseResponseModel>.Handle(UploadFileRequest request, CancellationToken cancellationToken)
        {
            try
            {
                var requestModel = new FileUploadRequestModel()
                {
                    File = request.File,
                    FileName = request.FileName,
                    FileSizeLimit = request.FileSizeLimit,
                };
                var fileUrl = await _azureStorageService.UploadFileToStorageAsync(requestModel);
                var response = new UploadFileResponse(fileUrl);

                if (_imageService.IsImageFromStream(request.File.OpenReadStream())
                    && !DefaultConstants.IMAGE_TYPES_UNSUPPORT_THUMBNAIL.Split(',').Contains(request.File.ContentType))
                {
                    await GenerateThumbnail(requestModel);
                }
                return BaseResponseModel.ReturnData(response);
            }
            catch (Exception ex)
            {
                return BaseResponseModel.ReturnError(ex.Message);
            }
        }

        #region private methods

        private async Task GenerateThumbnail(FileUploadRequestModel request)
        {
            try
            {
                string thumbNamePattern = "{0}.thumb.{1}";
                using var fileStream = request.File.OpenReadStream();

                //Generate thumbnail for web size
                var msWeb = new MemoryStream();
                using Stream streamThumbWeb = _imageService.GenerateThumbnail(Image.FromStream(fileStream), request.File.ContentType, DefaultConstants.IMAGE_THUMBNAIL_MAX_EDGES_WEB);
                streamThumbWeb.Position = 0;
                await streamThumbWeb.CopyToAsync(msWeb);
                await _azureStorageService.UploadFileToStorageAsync(msWeb, string.Format(thumbNamePattern, request.FileName, "web"), request.File.ContentType);

                //Generate thumbnail for mobile size
                var msMobile = new MemoryStream();
                using Stream streamThumbMobile = _imageService.GenerateThumbnail(Image.FromStream(fileStream), request.File.ContentType, DefaultConstants.IMAGE_THUMBNAIL_MAX_EDGES_MOBILE);
                streamThumbMobile.Position = 0;
                await streamThumbMobile.CopyToAsync(msMobile);
                await _azureStorageService.UploadFileToStorageAsync(msMobile, string.Format(thumbNamePattern, request.FileName, "mobile"), request.File.ContentType);
            }
            catch (Exception ex) { }
        }
        #endregion private methods
    }
}