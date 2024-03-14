using eShopping.Application.Features.Users.Commands;
using eShopping.WebApi.Controllers.Base;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace eShopping.WebApi.Controllers
{
    [Authorize]
    [Route("/api/Account")]
    public class AccountController : BaseApiController
    {
        public AccountController(IMediator mediator) : base(mediator)
        {
        }

        [HttpPost]
        [Route("update-password")]
        public async Task<IActionResult> UpdatePasswordAsync([FromBody] UpdatePasswordRequest request)
        {
            bool response = await _mediator.Send(request);
            return await SafeOkAsync(response);
        }

        [HttpPut]
        [Route("disable-account")]
        public async Task<IActionResult> DisableAccount([FromRoute] DisableAccountRequest request)
        {
            bool response = await _mediator.Send(request);
            return await SafeOkAsync(response);
        }
    }
}
