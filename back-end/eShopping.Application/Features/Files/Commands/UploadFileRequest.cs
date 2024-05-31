using eShopping.Common.Constants;
using eShopping.Common.Helpers;
using eShopping.Common.Models;
using eShopping.Interfaces.Common;
using eShopping.Storage.Azure;
using eShopping.Storage.Models;
using MediatR;
using Microsoft.AspNetCore.Http;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace eShopping.Application.Features.Files.Commands
{
    public class UploadFileRequest : IRequest<BaseResponseModel>
    {
        public IFormFile File { get; set; }
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
                    FileName = StringHelpers.RemoveExtensionType(request.File.FileName),
                    FileSizeLimit = DefaultConstants.STORE_IMAGE_LIMIT,
                };
                var fileUrl = await _azureStorageService.UploadFileToStorageAsync(requestModel);
                return BaseResponseModel.ReturnData(fileUrl);
            }
            catch (Exception ex)
            {
                return BaseResponseModel.ReturnError(ex.Message);
            }
        }
    }
}