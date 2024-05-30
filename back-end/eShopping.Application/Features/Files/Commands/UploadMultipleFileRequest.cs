using eShopping.Common.Constants;
using eShopping.Common.Helpers;
using eShopping.Common.Models;
using eShopping.Interfaces.Common;
using eShopping.Storage.Azure;
using eShopping.Storage.Models;
using MediatR;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.IO;
using System.Threading;
using System.Threading.Tasks;

namespace eShopping.Application.Features.Files.Commands
{
    public class UploadMultipleFileRequest : IRequest<BaseResponseModel>
    {
        public IFormFileCollection Files { get; set; }
    }

    public class UploadMultipleFileRequestHandler : IRequestHandler<UploadMultipleFileRequest, BaseResponseModel>
    {
        private readonly IAzureStorageService _azureStorageService;
        private readonly IImageService _imageService;

        public UploadMultipleFileRequestHandler(IAzureStorageService azureStorageService, IImageService imageService)
        {
            _azureStorageService = azureStorageService;
            _imageService = imageService;
        }

        async Task<BaseResponseModel> IRequestHandler<UploadMultipleFileRequest, BaseResponseModel>.Handle(UploadMultipleFileRequest request, CancellationToken cancellationToken)
        {

            if (request.Files == null || request.Files.Count <= 0)
                return BaseResponseModel.ReturnError("Không tìm thấy ảnh");

            if (request.Files.Count > 30)
                return BaseResponseModel.ReturnError("Chỉ có thể upload tối đa 20 ảnh");
            try
            {
                var response = new List<string>();
                foreach (var file in request.Files)
                {
                    var requestModel = new FileUploadRequestModel()
                    {
                        File = file,
                        FileName = StringHelpers.RemoveExtensionType(file.FileName),
                        FileSizeLimit = DefaultConstants.STORE_IMAGE_LIMIT,
                    };
                    var fileUrl = await _azureStorageService.UploadFileToStorageAsync(requestModel);
                    response.Add(fileUrl);
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