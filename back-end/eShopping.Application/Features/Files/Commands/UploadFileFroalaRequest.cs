using eShopping.Common.Constants;
using eShopping.Common.Models;
using MediatR;
using Microsoft.AspNetCore.Http;
using System.Threading;
using System.Threading.Tasks;

namespace eShopping.Application.Features.Files.Commands
{
    public class UploadFileFroalaRequest : IRequest<BaseResponseModel>
    {
        public UploadFileFroalaRequest()
        {
            FileSizeLimit = DefaultConstants.STORE_IMAGE_LIMIT;
        }

        public IFormFile File { get; set; }

        public string FileName { get; set; }

        public int FileSizeLimit { get; set; } = DefaultConstants.STORE_IMAGE_LIMIT;
    }

    public class UploadFileFroalaResponse
    {
        public string Link { get; set; }

        public UploadFileFroalaResponse(string link)
        {
            Link = link;
        }
    }

    public class UploadFileFroalaRequestHandler : IRequestHandler<UploadFileFroalaRequest, BaseResponseModel>
    {
        private readonly IMediator _mediator;

        public UploadFileFroalaRequestHandler(IMediator mediator)
        {
            _mediator = mediator;
        }

        public async Task<BaseResponseModel> Handle(UploadFileFroalaRequest request, CancellationToken cancellationToken)
        {
            var uploadFileRequest = new UploadFileRequest { File = request.File, FileName = request.FileName, FileSizeLimit = request.FileSizeLimit };
            var response = await _mediator.Send(uploadFileRequest);
            if (response != null)
            {
                return BaseResponseModel.ReturnData(new UploadFileFroalaResponse(response.Data.Link));
            }
            return BaseResponseModel.ReturnError("cannot.upload.image");
        }
    }
}