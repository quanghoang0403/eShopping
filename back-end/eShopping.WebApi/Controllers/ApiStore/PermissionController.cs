using eShopping.Application.Features.Settings.Queries;
using eShopping.WebApi.Controllers.Base;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace eShopping.WebApi.Controllers.ApiStore
{
    [Authorize]
    public class PermissionController : BaseApiStoreController

    {
        public PermissionController(IMediator mediator) : base(mediator)
        {
        }

        [AllowAnonymous]
        [HttpGet]
        [Route("get-permissions")]
        public async Task<IActionResult> GetPermissionsAsync([FromQuery] string token)
        {
            var response = await _mediator.Send(new AdminGetPermissionsRequest() { Token = token });
            return await SafeOkAsync(response);
        }
    }
}
