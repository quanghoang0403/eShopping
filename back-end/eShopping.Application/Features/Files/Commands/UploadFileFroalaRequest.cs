using eShopping.Common.Constants;
using MediatR;
using Microsoft.AspNetCore.Http;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace eShopping.Application.Features.Files.Commands
{
    public class UploadFileFroalaRequest : IRequest<UploadFileFroalaResponse>
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

    public class UploadFileFroalaRequestHandler : IRequestHandler<UploadFileFroalaRequest, UploadFileFroalaResponse>
    {
        private readonly IMediator _mediator;

        public UploadFileFroalaRequestHandler(IMediator mediator)
        {
            _mediator = mediator;
        }

        public async Task<UploadFileFroalaResponse> Handle(UploadFileFroalaRequest request, CancellationToken cancellationToken)
        {
            var uploadFileRequest = new UploadFileRequest { File = request.File, FileName = request.FileName, FileSizeLimit = request.FileSizeLimit };
            var response = await _mediator.Send(uploadFileRequest);
            if (response != null)
            {
                return new UploadFileFroalaResponse(response.Link);
            }
            throw new Exception("cannot.upload.image");
        }
    }
}