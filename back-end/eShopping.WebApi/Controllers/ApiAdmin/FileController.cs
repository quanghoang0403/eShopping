﻿using eShopping.Application.Features.Files.Commands;
using eShopping.Application.Features.Files.Queries;
using eShopping.WebApi.Controllers.Base;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace GoFoodBeverage.WebApi.Controllers.v3_3
{
    [Authorize]
    public class FileController : BaseApiAdminController
    {
        public FileController(IMediator mediator) : base(mediator)
        {
        }

        [HttpPost]
        [Route("upload")]
        [AllowAnonymous]
        public async Task<IActionResult> UploadAsync([FromForm] UploadFileRequest request)
        {
            var respsone = await _mediator.Send(request);
            return SafeOk(respsone);
        }


        [HttpGet]
        [Route("get-base64-image")]
        [AllowAnonymous]
        public async Task<IActionResult> GetBase64Image([FromQuery] string url)
        {
            var respsone = await _mediator.Send(new GetBase64ImageRequest() { Url = url });
            return SafeOk(respsone);
        }

        [HttpPost]
        [Route("upload-froala")]
        [AllowAnonymous]
        public async Task<IActionResult> UploadFroalaAsync([FromForm] UploadFileFroalaRequest request)
        {
            var respsone = await _mediator.Send(request);
            return SafeOk(respsone);
        }
    }
}