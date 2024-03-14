using eShopping.Application.Features.Settings.Queries;
using eShopping.WebApi.Controllers.Base;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

namespace eShopping.WebApi.Controllers
{
    [Authorize]
    public class PermissionController : BaseApiController
    {
        public PermissionController(IMediator mediator) : base(mediator)
        {
        }

        [AllowAnonymous]
        [HttpGet]
        [Route("get-permissions")]
        public async Task<IActionResult> GetPermissionsAsync([FromQuery] string token)
        {
            var response = await _mediator.Send(new GetPermissionsRequest() { Token = token });
            return await SafeOkAsync(response);
        }

        [HttpGet]
        [Route("get-all-permission-groups")]
        public async Task<IActionResult> GetAllPermissionGroupsAsync()
        {
            var response = await _mediator.Send(new GetAllPermissionGroupsRequest());
            return await SafeOkAsync(response);
        }


        [HttpGet]
        [Route("get-permission-group-by-id/{id}")]
        public async Task<IActionResult> GetPermissionGroupByIdAsync(Guid id)
        {
            var response = await _mediator.Send(new GetPermissionGroupByIdRequest() { Id = id });
            return await SafeOkAsync(response);
        }

        //[HttpPost]
        //[Route("create-permission-group")]
        //public async Task<IActionResult> CreateGroupPermissionAsync([FromBody] CreatePermissionGroupRequest request)
        //{
        //    var response = await _mediator.Send(request);
        //    return await SafeOkAsync(response);
        //}

        //[HttpPut]
        //[Route("update-permission-group-by-id")]
        //public async Task<IActionResult> UpdateGroupPermissionByIdAsync([FromBody] UpdatePermissionGroupRequest request)
        //{
        //    var response = await _mediator.Send(request);
        //    return await SafeOkAsync(response);
        //}

    }
}
