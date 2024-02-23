using eShopping.Application.Features.Staffs.Commands;
using eShopping.Common.Attributes.Permission;
using eShopping.Domain.Enums;
using eShopping.WebApi.Controllers.Base;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace eShopping.WebApi.Controllers
{
    [Authorize]
    public class StaffController : BaseApiController
    {
        public StaffController(IMediator mediator) : base(mediator)
        {

        }

        [HttpPost]
        [Route("create-staff")]
        [HasPermission(EnumPermission.ADMIN)]
        public async Task<IActionResult> CreateStaffAsync([FromBody] CreateStaffRequest request)
        {
            var response = await _mediator.Send(request);
            return await SafeOkAsync(response);
        }

        [HttpGet("TestAdmin")]
        [HasPermission(EnumPermission.VIEW_PRODUCT)]
        public IActionResult TestAdmin()
        {
            return Ok("Pong");
        }
    }
}
