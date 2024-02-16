using eShopping.Application.Common.Features.Authenticate.Commands;
using eShopping.Application.Features.Users.Commands;
using eShopping.WebApi.Admin.Controllers.Base;

using MediatR;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace eShopping.WebApi.Admin.Controllers
{
    public class AuthenticateController : BaseApiController
    {
        public AuthenticateController(IMediator mediator) : base(mediator)
        {
        }

        [HttpPost]
        [Route("authenticate")]
        public async Task<IActionResult> Authenticate([FromBody] AuthenticateRequest request)
        {
            var response = await _mediator.Send(request);
            return SafeOk(response);
        }

        [HttpPost]
        [Route("refresh-token-and-permissions")]
        public async Task<IActionResult> RefreshTokenAndPermissionsAsync([FromHeader] RefreshTokenAndPermissionsRequest request)
        {
            var response = await _mediator.Send(request);
            return SafeOk(response);
        }
    }
}