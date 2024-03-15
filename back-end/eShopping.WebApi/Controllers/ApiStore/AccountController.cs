using eShopping.Application.Features.Users.Commands;
using eShopping.WebApi.Controllers.Base;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace eShopping.WebApi.Controllers.ApiStore
{
    [Authorize]
    public class AccountController : BaseApiStoreController
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
    }
}
