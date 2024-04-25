using eShopping.Application.Features.Users.Commands;
using eShopping.WebApi.Controllers.Base;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace eShopping.WebApi.Controllers.ApiStore
{
    public class AuthenticateController : BaseApiStoreController
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
        [Route("refresh-token")]
        public async Task<IActionResult> RefreshTokenAsync(RefreshTokenRequest request)
        {
            var response = await _mediator.Send(request);
            return SafeOk(response);
        }
    }
}