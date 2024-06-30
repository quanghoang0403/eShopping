using eShopping.Application.Features.Users.Commands;
using eShopping.Application.Features.Users.Commands.Store;
using eShopping.WebApi.Controllers.Base;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace eShopping.WebApi.Controllers.ApiStore
{
    public class AuthController : BaseApiStoreController
    {
        public AuthController(IMediator mediator) : base(mediator)
        {
        }

        //[HttpPost]
        //[Route("sign-up")]
        //public async Task<IActionResult> CreateCustomerAsync([FromBody] CreateCustomerRequest request)
        //{
        //    var response = await _mediator.Send(request);
        //    return Ok(response);
        //}


        [HttpPost]
        [Route("sign-up")]
        public async Task<IActionResult> SignUp([FromBody] SignUpWithPassword request)
        {
            var response = await _mediator.Send(request);
            return Ok(response);
        }

        [HttpPost]
        [Route("sign-in-with-google")]
        public async Task<IActionResult> SignInWithGoogleAsync([FromBody] SignInWithGoogleRequest request)
        {
            var response = await _mediator.Send(request);
            return Ok(response);
        }

        [HttpPost]
        [Route("sign-in")]
        public async Task<IActionResult> SignInAsync([FromBody] SignInRequest request)
        {
            var response = await _mediator.Send(request);
            return Ok(response);
        }

        [HttpPost]
        [Route("refresh-token")]
        public async Task<IActionResult> RefreshTokenAsync(RefreshTokenRequest request)
        {
            var response = await _mediator.Send(request);
            return Ok(response);
        }

        [HttpPost]
        [Route("renew-password")]
        public async Task<IActionResult> RenewPasswordAsync([FromBody] RenewPasswordRequest request)
        {
            var response = await _mediator.Send(request);
            return Ok(response);
        }
    }
}