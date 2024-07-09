using eShopping.Application.Features.Customers.Commands;
using eShopping.Application.Features.Customers.Queries;
using eShopping.Application.Features.Users.Commands;
using eShopping.Common.Attributes.Permission;
using eShopping.Domain.Enums;
using eShopping.WebApi.Controllers.Base;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace eShopping.WebApi.Controllers.ApiStore
{
    [Authorize]
    public class CustomerController : BaseApiStoreController
    {
        public CustomerController(IMediator mediator) : base(mediator)
        {
        }

        [HttpGet]
        [Route("get-customer-by-id")]
        [HasPermission(EnumPermission.STORE_WEB)]
        public async Task<IActionResult> GetCustomerByIdAsync([FromQuery] GetCustomerByIdRequest request)
        {
            var response = await _mediator.Send(request);
            return Ok(response);
        }

        [HttpPut]
        [Route("update-customer")]
        [HasPermission(EnumPermission.STORE_WEB)]
        public async Task<IActionResult> UpdateCustomerAsync([FromBody] UpdateCustomerRequest request)
        {
            var response = await _mediator.Send(request);
            return Ok(response);
        }

        [HttpPut]
        [Route("update-password")]
        [HasPermission(EnumPermission.STORE_WEB)]
        public async Task<IActionResult> UpdatePasswordAsync([FromBody] UpdatePasswordRequest request)
        {
            var response = await _mediator.Send(request);
            return Ok(response);
        }
    }
}
